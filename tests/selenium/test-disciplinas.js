const { By, until } = require('selenium-webdriver');
const { createDriver, BASE_URL } = require('./config');
const chai = require('chai');
const assert = chai.assert;

describe('Testes de Disciplinas', function() {
  this.timeout(40000);
  
  let driver;

  before(async function() {
    console.log('🔧 Iniciando Chrome WebDriver...');
    driver = await createDriver();
  });

  after(async function() {
    console.log('🔒 Fechando Chrome WebDriver...');
    if (driver) {
      await driver.quit();
    }
  });

  it('TC007 - Deve exibir formulário de cadastro de disciplina', async function() {
    await driver.get(BASE_URL);
    
    await driver.sleep(1000);
    
    const disciplinasTab = await driver.findElement(By.css('button[onclick="openTab(\'disciplinas\')"]'));
    await disciplinasTab.click();
    
    await driver.sleep(1000);
    
    const form = await driver.findElement(By.id('formCadastroDisciplina'));
    const isDisplayed = await form.isDisplayed();
    
    assert.isTrue(isDisplayed);
    console.log('✅ TC007 - Formulário de disciplina está visível');
  });

  it('TC008 - Deve cadastrar uma nova disciplina', async function() {
    await driver.get(BASE_URL);
    
    await driver.sleep(2000);
    
    // Ir para aba de disciplinas
    await driver.findElement(By.css('button[onclick="openTab(\'disciplinas\')"]')).click();
    await driver.sleep(2000);
    
    const timestamp = Date.now();
    
    // Preencher campos um por um com delays
    const nomeField = await driver.findElement(By.id('disc_nome'));
    await nomeField.clear();
    await nomeField.sendKeys('Teste Selenium');
    await driver.sleep(300);
    
    const codigoField = await driver.findElement(By.id('disc_codigo'));
    await codigoField.clear();
    await codigoField.sendKeys(`TST${timestamp}`);
    await driver.sleep(300);
    
    const univField = await driver.findElement(By.id('disc_universidade_id'));
    await univField.sendKeys('1'); // Enviar valor direto
    await driver.sleep(300);
    
    const cursoField = await driver.findElement(By.id('disc_curso_id'));
    await cursoField.sendKeys('1'); // Enviar valor direto
    await driver.sleep(300);
    
    const profField = await driver.findElement(By.id('disc_professor_id'));
    await profField.clear();
    await profField.sendKeys('1');
    await driver.sleep(300);
    
    const periodoField = await driver.findElement(By.id('disc_periodo_letivo'));
    await periodoField.clear();
    await periodoField.sendKeys('2025.1');
    await driver.sleep(300);
    
    const descField = await driver.findElement(By.id('disc_descricao'));
    await descField.clear();
    await descField.sendKeys('Disciplina de teste automatizado');
    await driver.sleep(500);
    
    // Clicar no botão submit
    const submitBtn = await driver.findElement(By.css('#formCadastroDisciplina button[type="submit"]'));
    await submitBtn.click();
    
    // Aguardar resposta
    await driver.sleep(5000);
    
    // Capturar resultado
    const resultDiv = await driver.findElement(By.id('resultDisciplina'));
    const resultClass = await resultDiv.getAttribute('class');
    const resultText = await resultDiv.getText();
    
    console.log(`📋 Classe do resultado: ${resultClass}`);
    console.log(`📋 Texto do resultado: ${resultText}`);
    
    // Se deu erro, investigar
    if (resultClass.includes('error')) {
      console.log(`⚠️ ERRO DETECTADO: ${resultText}`);
      
      // Verificar se é erro de professor não encontrado
      if (resultText.toLowerCase().includes('professor') || 
          resultText.toLowerCase().includes('foreign key') ||
          resultText.toLowerCase().includes('violates')) {
        
        console.log('ℹ️ Problema: Professor ID 1 não existe no banco');
        console.log('ℹ️ Vamos primeiro verificar/criar um professor...');
        
        // Ir para aba usuários e criar professor
        await driver.findElement(By.css('button[onclick="openTab(\'usuarios\')"]')).click();
        await driver.sleep(2000);
        
        const timestamp2 = Date.now();
        await driver.findElement(By.id('nome_completo')).sendKeys('Prof. Teste Selenium');
        await driver.findElement(By.id('email')).sendKeys(`prof.sel.${timestamp2}@unifei.edu.br`);
        await driver.findElement(By.id('senha')).sendKeys('senha12345');
        await driver.findElement(By.id('universidade_id')).sendKeys('1');
        await driver.findElement(By.id('curso_id')).sendKeys('1');
        await driver.findElement(By.id('periodo')).sendKeys('1');
        await driver.findElement(By.id('tipo_usuario')).sendKeys('Professor');
        await driver.findElement(By.css('#formCadastroUsuario button[type="submit"]')).click();
        await driver.sleep(3000);
        
        console.log('✅ Professor criado. Tentando cadastrar disciplina novamente...');
        
        // Voltar para disciplinas e tentar novamente
        await driver.findElement(By.css('button[onclick="openTab(\'disciplinas\')"]')).click();
        await driver.sleep(2000);
        
        // Preencher novamente
        await driver.findElement(By.id('disc_nome')).sendKeys('Teste Selenium');
        await driver.findElement(By.id('disc_codigo')).sendKeys(`TST${Date.now()}`);
        await driver.findElement(By.id('disc_universidade_id')).sendKeys('1');
        await driver.findElement(By.id('disc_curso_id')).sendKeys('1');
        await driver.findElement(By.id('disc_professor_id')).sendKeys('1');
        await driver.findElement(By.id('disc_periodo_letivo')).sendKeys('2025.1');
        await driver.findElement(By.id('disc_descricao')).sendKeys('Teste automatizado');
        await driver.findElement(By.css('#formCadastroDisciplina button[type="submit"]')).click();
        await driver.sleep(5000);
        
        const resultDiv2 = await driver.findElement(By.id('resultDisciplina'));
        const resultClass2 = await resultDiv2.getAttribute('class');
        const resultText2 = await resultDiv2.getText();
        
        console.log(`📋 Segunda tentativa - Classe: ${resultClass2}`);
        console.log(`📋 Segunda tentativa - Texto: ${resultText2}`);
        
        assert.include(resultClass2, 'success', `Falhou na segunda tentativa: ${resultText2}`);
        console.log('✅ TC008 - Disciplina cadastrada com sucesso (segunda tentativa)');
      } else {
        // Outro tipo de erro
        assert.fail(`Erro inesperado ao cadastrar disciplina: ${resultText}`);
      }
    } else {
      // Sucesso na primeira tentativa
      assert.include(resultClass, 'success');
      console.log('✅ TC008 - Disciplina cadastrada com sucesso');
    }
  });

  it('TC009 - Deve listar disciplinas cadastradas', async function() {
    await driver.get(BASE_URL);
    
    await driver.sleep(1000);
    
    await driver.findElement(By.css('button[onclick="openTab(\'disciplinas\')"]')).click();
    await driver.sleep(2000);
    
    await driver.findElement(By.css('button[onclick="listarDisciplinas()"]')).click();
    await driver.sleep(3000);
    
    const listaDiv = await driver.findElement(By.id('listaDisciplinas'));
    const listaDivText = await listaDiv.getText();
    
    const items = await listaDiv.findElements(By.className('list-item'));
    
    if (items.length === 0) {
      console.log('ℹ️ Nenhuma disciplina encontrada - verificando se mostra mensagem correta');
      assert.include(listaDivText.toLowerCase(), 'nenhuma');
      console.log('✅ TC009 - Lista vazia exibida corretamente');
    } else {
      assert.isAtLeast(items.length, 1);
      console.log(`✅ TC009 - ${items.length} disciplina(s) encontrada(s) na lista`);
    }
  });

  it('TC010 - Deve validar aba Sobre', async function() {
    await driver.get(BASE_URL);
    
    await driver.sleep(1000);
    
    await driver.findElement(By.css('button[onclick="openTab(\'sobre\')"]')).click();
    await driver.sleep(1000);
    
    const sobreContent = await driver.findElement(By.id('sobre'));
    const isDisplayed = await sobreContent.isDisplayed();
    
    assert.isTrue(isDisplayed);
    
    const text = await sobreContent.getText();
    assert.include(text, 'UNIFEI');
    
    console.log('✅ TC010 - Aba Sobre funcionando corretamente');
  });
});
