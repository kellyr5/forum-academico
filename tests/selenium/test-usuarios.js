const { By, until } = require('selenium-webdriver');
const { createDriver, BASE_URL } = require('./config');
const chai = require('chai');
const assert = chai.assert;

describe('Testes de Usuários', function() {
  this.timeout(30000);
  
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

  it('TC001 - Deve carregar a página principal', async function() {
    await driver.get(BASE_URL);
    
    const title = await driver.getTitle();
    assert.include(title, 'Fórum Acadêmico');
    
    console.log('✅ TC001 - Página principal carregada com sucesso');
  });

  it('TC002 - Deve exibir formulário de cadastro de usuário', async function() {
    await driver.get(BASE_URL);
    
    // Aguardar a página carregar completamente
    await driver.sleep(2000);
    
    // Aguardar o formulário estar presente
    await driver.wait(until.elementLocated(By.id('formCadastroUsuario')), 10000);
    
    const form = await driver.findElement(By.id('formCadastroUsuario'));
    
    // Aguardar o formulário estar visível
    await driver.wait(until.elementIsVisible(form), 5000);
    
    const isDisplayed = await form.isDisplayed();
    
    assert.isTrue(isDisplayed);
    console.log('✅ TC002 - Formulário de usuário está visível');
  });

  it('TC003 - Deve cadastrar um novo usuário', async function() {
    await driver.get(BASE_URL);
    
    await driver.sleep(2000);
    
    const timestamp = Date.now();
    
    await driver.findElement(By.id('nome_completo')).sendKeys('Teste Selenium Silva');
    await driver.findElement(By.id('email')).sendKeys(`teste.selenium.${timestamp}@unifei.edu.br`);
    await driver.findElement(By.id('senha')).sendKeys('senha12345');
    
    const universidadeSelect = await driver.findElement(By.id('universidade_id'));
    await universidadeSelect.sendKeys('UNIFEI');
    
    const cursoSelect = await driver.findElement(By.id('curso_id'));
    await cursoSelect.sendKeys('Engenharia de Computação');
    
    const periodoSelect = await driver.findElement(By.id('periodo'));
    await periodoSelect.sendKeys('5º Período');
    
    const tipoSelect = await driver.findElement(By.id('tipo_usuario'));
    await tipoSelect.sendKeys('Aluno');
    
    await driver.findElement(By.css('#formCadastroUsuario button[type="submit"]')).click();
    
    await driver.sleep(3000);
    
    const resultDiv = await driver.findElement(By.id('resultUsuario'));
    const resultClass = await resultDiv.getAttribute('class');
    
    assert.include(resultClass, 'success');
    console.log('✅ TC003 - Usuário cadastrado com sucesso via Selenium');
  });

  it('TC004 - Deve listar usuários cadastrados', async function() {
    await driver.get(BASE_URL);
    
    await driver.sleep(2000);
    
    await driver.wait(until.elementLocated(By.css('button[onclick="listarUsuarios()"]')), 10000);
    await driver.findElement(By.css('button[onclick="listarUsuarios()"]')).click();
    
    await driver.sleep(3000);
    
    const listaDiv = await driver.findElement(By.id('listaUsuarios'));
    const items = await listaDiv.findElements(By.className('list-item'));
    
    assert.isAtLeast(items.length, 1);
    console.log(`✅ TC004 - ${items.length} usuário(s) encontrado(s) na lista`);
  });

  it('TC005 - Deve mudar para aba de disciplinas', async function() {
    await driver.get(BASE_URL);
    
    await driver.sleep(1000);
    
    const disciplinasTab = await driver.findElement(By.css('button[onclick="openTab(\'disciplinas\')"]'));
    await disciplinasTab.click();
    
    await driver.sleep(1000);
    
    const disciplinasContent = await driver.findElement(By.id('disciplinas'));
    const isDisplayed = await disciplinasContent.isDisplayed();
    
    assert.isTrue(isDisplayed);
    console.log('✅ TC005 - Navegação entre abas funcionando');
  });

  it('TC006 - Deve validar campos obrigatórios', async function() {
    await driver.get(BASE_URL);
    
    await driver.sleep(1000);
    
    const submitButton = await driver.findElement(By.css('#formCadastroUsuario button[type="submit"]'));
    await submitButton.click();
    
    await driver.sleep(1000);
    
    const nomeInput = await driver.findElement(By.id('nome_completo'));
    const isValid = await driver.executeScript('return arguments[0].validity.valid;', nomeInput);
    
    assert.isFalse(isValid);
    console.log('✅ TC006 - Validação de campos obrigatórios funcionando');
  });
});
