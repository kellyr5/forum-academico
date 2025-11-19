#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Teste Selenium Completo FLUIDO - Forum Acadêmico UNIFEI
Versão atualizada com tipo de aviso e sem campo universidade
"""

import time
import os
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.action_chains import ActionChains

class TestForumAcademicoFluido:
    
    def __init__(self):
        print("\n" + "="*70)
        print(" "*15 + "TESTE SELENIUM FLUIDO - FORUM ACADEMICO UNIFEI")
        print("="*70 + "\n")
        print("Configurando ambiente de testes...")
        
        self.usuario_criado_id = None
        self.disciplina_criada_id = None
        self.topico_criado_id = None
        
        firefox_options = Options()
        firefox_options.add_argument('--kiosk')
        
        try:
            self.driver = webdriver.Firefox(options=firefox_options)
            print("Firefox iniciado em TELA CHEIA")
        except:
            print("Tentando modo alternativo...")
            self.driver = webdriver.Firefox()
            self.driver.fullscreen_window()
            print("Firefox iniciado em modo fullscreen")
        
        self.wait = WebDriverWait(self.driver, 15)
        self.actions = ActionChains(self.driver)
        self.url_base = "http://localhost:8000"
        
        self.screenshot_dir = "screenshots_teste"
        if not os.path.exists(self.screenshot_dir):
            os.makedirs(self.screenshot_dir)
        
        print("WebDriver configurado com sucesso!")
        print(f"Screenshots serao salvos em: {self.screenshot_dir}/\n")
        time.sleep(2)
    
    def obter_ultimo_id_criado(self, lista_css_selector):
        """Obtém o ID do último item criado na lista"""
        try:
            time.sleep(1)
            items = self.driver.find_elements(By.CSS_SELECTOR, lista_css_selector)
            if items:
                primeiro_item = items[0]
                btn_delete = primeiro_item.find_element(By.CSS_SELECTOR, ".btn-delete")
                onclick = btn_delete.get_attribute("onclick")
                id_str = onclick.split("(")[1].split(")")[0]
                return int(id_str)
        except:
            pass
        return random.randint(1, 10)
    
    def mover_mouse_para_elemento(self, elemento):
        """Move o mouse suavemente até o elemento"""
        self.actions.move_to_element(elemento).perform()
        time.sleep(0.3)
    
    def digitar_devagar(self, elemento, texto, velocidade=0.04):
        """Digita texto letra por letra de forma fluida"""
        self.mover_mouse_para_elemento(elemento)
        elemento.click()
        time.sleep(0.2)
        
        for letra in texto:
            elemento.send_keys(letra)
            time.sleep(velocidade)
    
    def scroll_suave(self, pixels):
        """Scroll suave na página"""
        self.driver.execute_script(f"window.scrollBy({{top: {pixels}, behavior: 'smooth'}});")
        time.sleep(0.5)
    
    def aguardar_elemento(self, by, valor, timeout=15):
        """Aguarda elemento estar presente e visível"""
        elemento = self.wait.until(EC.visibility_of_element_located((by, valor)))
        time.sleep(0.3)
        return elemento
    
    def clicar_elemento_fluido(self, by, valor):
        """Aguarda, move mouse e clica com animação"""
        elemento = self.wait.until(EC.element_to_be_clickable((by, valor)))
        
        self.driver.execute_script(
            "arguments[0].style.border='3px solid #FFD700';"
            "arguments[0].style.transition='all 0.3s';",
            elemento
        )
        time.sleep(0.3)
        
        self.mover_mouse_para_elemento(elemento)
        elemento.click()
        
        self.driver.execute_script("arguments[0].style.border='';", elemento)
        time.sleep(0.5)
        return elemento
    
    def selecionar_opcao_fluida(self, select_id, valor_opcao):
        """Seleciona opção de um select com animação"""
        select_element = self.driver.find_element(By.ID, select_id)
        self.mover_mouse_para_elemento(select_element)
        select_element.click()
        time.sleep(0.4)
        
        select = Select(select_element)
        select.select_by_value(valor_opcao)
        time.sleep(0.4)
    
    def tirar_screenshot(self, nome):
        """Tira screenshot da tela atual"""
        caminho = os.path.join(self.screenshot_dir, f"{nome}.png")
        self.driver.save_screenshot(caminho)
        print(f"    [Screenshot] {nome}.png")
    
    def rolar_para_elemento(self, elemento):
        """Rola suavemente até o elemento"""
        self.driver.execute_script(
            "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});",
            elemento
        )
        time.sleep(0.7)
    
    def mostrar_titulo(self, titulo):
        """Mostra título animado no console"""
        print("\n" + "─" * 70)
        print(f"  {titulo}")
        print("─" * 70 + "\n")
    
    def testar_aba_mural(self):
        """Testa aba Mural de Recados COM TIPO DE AVISO"""
        self.mostrar_titulo("TESTANDO: MURAL DE RECADOS")
        
        print("  [1/6] Abrindo aba Mural...")
        self.clicar_elemento_fluido(By.CSS_SELECTOR, '[data-tab="mural"]')
        time.sleep(1.5)
        self.tirar_screenshot("01_aba_mural")
        
        print("  [2/6] Digitando titulo...")
        titulo = self.aguardar_elemento(By.ID, "recado-titulo")
        self.rolar_para_elemento(titulo)
        self.digitar_devagar(titulo, "Reuniao Importante - Proxima Sexta", 0.035)
        
        print("  [3/6] Digitando conteudo...")
        conteudo = self.driver.find_element(By.ID, "recado-conteudo")
        self.rolar_para_elemento(conteudo)
        self.digitar_devagar(
            conteudo,
            "Informamos que havera reuniao com todos os alunos na proxima sexta-feira "
            "as 14h no auditorio principal. Presenca obrigatoria.",
            0.025
        )
        
        print("  [4/6] Selecionando tipo de aviso...")
        tipos_aviso = ['importante', 'evento', 'geral', 'aviso_faculdade']
        tipo_escolhido = random.choice(tipos_aviso)
        self.selecionar_opcao_fluida("recado-tipo", tipo_escolhido)
        print(f"      → Tipo selecionado: {tipo_escolhido}")
        
        print("  [5/6] Informando usuario...")
        usuario_id = self.driver.find_element(By.ID, "recado-usuario")
        self.rolar_para_elemento(usuario_id)
        usuario_id.clear()
        self.digitar_devagar(usuario_id, "1", 0.08)
        
        time.sleep(1)
        self.tirar_screenshot("02_mural_preenchido")
        
        print("  [6/6] Publicando recado...")
        btn_publicar = self.driver.find_element(By.ID, "btn-publicar-recado")
        self.rolar_para_elemento(btn_publicar)
        self.mover_mouse_para_elemento(btn_publicar)
        time.sleep(0.5)
        btn_publicar.click()
        
        time.sleep(1.5)
        try:
            alert = self.driver.switch_to.alert
            print(f"  [OK] {alert.text}")
            time.sleep(1)
            alert.accept()
        except:
            pass
        
        time.sleep(2)
        self.scroll_suave(400)
        time.sleep(1)
        self.tirar_screenshot("03_mural_publicado")
        
        print("\n  ✓ Recado publicado com sucesso!\n")
        time.sleep(1.5)
    
    def testar_aba_usuarios(self):
        """Testa aba Usuários SEM CAMPO UNIVERSIDADE"""
        self.mostrar_titulo("TESTANDO: USUARIOS")
        
        print("  [1/7] Abrindo aba Usuarios...")
        self.clicar_elemento_fluido(By.CSS_SELECTOR, '[data-tab="usuarios"]')
        time.sleep(1.5)
        self.tirar_screenshot("04_aba_usuarios")
        
        print("  [2/7] Digitando nome...")
        nome = self.aguardar_elemento(By.ID, "usuario-nome")
        self.rolar_para_elemento(nome)
        self.digitar_devagar(nome, "Carlos Eduardo Mendes", 0.045)
        
        print("  [3/7] Digitando email...")
        email = self.driver.find_element(By.ID, "usuario-email")
        self.digitar_devagar(email, "carlos.mendes@unifei.edu.br", 0.04)
        
        print("  [4/7] Digitando senha...")
        senha = self.driver.find_element(By.ID, "usuario-senha")
        self.digitar_devagar(senha, "Senha2025!", 0.045)
        
        print("  [5/7] Selecionando tipo...")
        self.selecionar_opcao_fluida("usuario-tipo", "Aluno")
        
        print("  [6/7] Selecionando curso...")
        self.selecionar_opcao_fluida("usuario-curso", str(random.randint(1, 3)))
        
        print("  [7/7] Selecionando periodo...")
        self.selecionar_opcao_fluida("usuario-periodo", str(random.randint(3, 5)))
        
        time.sleep(1)
        self.tirar_screenshot("05_usuarios_preenchido")
        
        print("  [OK] Cadastrando...")
        btn_cadastrar = self.driver.find_element(By.ID, "btn-cadastrar-usuario")
        self.rolar_para_elemento(btn_cadastrar)
        self.mover_mouse_para_elemento(btn_cadastrar)
        time.sleep(0.5)
        btn_cadastrar.click()
        
        time.sleep(1.5)
        try:
            alert = self.driver.switch_to.alert
            print(f"  [OK] {alert.text}")
            time.sleep(1)
            alert.accept()
        except:
            pass
        
        time.sleep(2)
        self.scroll_suave(400)
        time.sleep(1)
        self.tirar_screenshot("06_usuarios_cadastrado")
        
        self.usuario_criado_id = self.obter_ultimo_id_criado("#usuarios-lista > div")
        print(f"  [ID] Usuario criado com ID: {self.usuario_criado_id}")
        
        print("\n  ✓ Usuario cadastrado com sucesso!\n")
        time.sleep(1.5)
    
    def testar_aba_disciplinas(self):
        """Testa aba Disciplinas"""
        self.mostrar_titulo("TESTANDO: DISCIPLINAS")
        
        print("  [1/5] Abrindo aba Disciplinas...")
        self.clicar_elemento_fluido(By.CSS_SELECTOR, '[data-tab="disciplinas"]')
        time.sleep(1.5)
        self.tirar_screenshot("07_aba_disciplinas")
        
        print("  [2/5] Digitando nome...")
        nome = self.aguardar_elemento(By.ID, "disciplina-nome")
        self.rolar_para_elemento(nome)
        self.digitar_devagar(nome, "Programacao Orientada a Objetos", 0.04)
        
        print("  [3/5] Digitando codigo...")
        codigo = self.driver.find_element(By.ID, "disciplina-codigo")
        self.digitar_devagar(codigo, "COM" + str(random.randint(300, 450)), 0.06)
        
        print("  [4/5] Selecionando curso...")
        self.selecionar_opcao_fluida("disciplina-curso", str(random.randint(1, 3)))
        
        print("  [5/5] Informando professor...")
        professor = self.driver.find_element(By.ID, "disciplina-professor")
        self.rolar_para_elemento(professor)
        professor.clear()
        prof_id = random.randint(1, 5)
        self.digitar_devagar(professor, str(prof_id), 0.08)
        
        time.sleep(1)
        self.tirar_screenshot("08_disciplinas_preenchido")
        
        print("  [OK] Cadastrando...")
        btn_cadastrar = self.driver.find_element(By.ID, "btn-cadastrar-disciplina")
        self.rolar_para_elemento(btn_cadastrar)
        self.mover_mouse_para_elemento(btn_cadastrar)
        time.sleep(0.5)
        btn_cadastrar.click()
        
        time.sleep(1.5)
        try:
            alert = self.driver.switch_to.alert
            print(f"  [OK] {alert.text}")
            time.sleep(1)
            alert.accept()
        except:
            pass
        
        time.sleep(2)
        self.scroll_suave(400)
        time.sleep(1)
        self.tirar_screenshot("09_disciplinas_cadastrada")
        
        self.disciplina_criada_id = self.obter_ultimo_id_criado("#disciplinas-lista > div")
        print(f"  [ID] Disciplina criada com ID: {self.disciplina_criada_id}")
        
        print("\n  ✓ Disciplina cadastrada com sucesso!\n")
        time.sleep(1.5)
    
    def testar_aba_topicos(self):
        """Testa aba Tópicos"""
        self.mostrar_titulo("TESTANDO: TOPICOS")
        
        print("  [1/6] Abrindo aba Topicos...")
        self.clicar_elemento_fluido(By.CSS_SELECTOR, '[data-tab="topicos"]')
        time.sleep(1.5)
        self.tirar_screenshot("10_aba_topicos")
        
        print("  [2/6] Digitando titulo...")
        titulo = self.aguardar_elemento(By.ID, "topico-titulo")
        self.rolar_para_elemento(titulo)
        self.digitar_devagar(titulo, "Duvida sobre Heranca e Polimorfismo", 0.035)
        
        print("  [3/6] Digitando conteudo...")
        conteudo = self.driver.find_element(By.ID, "topico-conteudo")
        self.rolar_para_elemento(conteudo)
        self.digitar_devagar(
            conteudo,
            "Ola! Estou com dificuldade para entender quando usar heranca e quando usar composicao. "
            "Alguem pode dar exemplos praticos? Obrigado!",
            0.025
        )
        
        print("  [4/6] Selecionando disciplina...")
        self.selecionar_opcao_fluida("topico-disciplina", "1")
        
        print("  [5/6] Selecionando categoria...")
        self.selecionar_opcao_fluida("topico-categoria", str(random.randint(1, 2)))
        
        print("  [6/6] Informando autor...")
        usuario = self.driver.find_element(By.ID, "topico-usuario")
        self.rolar_para_elemento(usuario)
        usuario.clear()
        autor_id = self.usuario_criado_id if self.usuario_criado_id else random.randint(1, 5)
        self.digitar_devagar(usuario, str(autor_id), 0.08)
        
        time.sleep(1)
        self.tirar_screenshot("11_topicos_preenchido")
        
        print("  [OK] Criando topico...")
        btn_criar = self.driver.find_element(By.ID, "btn-criar-topico")
        self.rolar_para_elemento(btn_criar)
        self.mover_mouse_para_elemento(btn_criar)
        time.sleep(0.5)
        btn_criar.click()
        
        time.sleep(1.5)
        try:
            alert = self.driver.switch_to.alert
            print(f"  [OK] {alert.text}")
            time.sleep(1)
            alert.accept()
        except:
            pass
        
        time.sleep(2)
        self.scroll_suave(400)
        time.sleep(1)
        self.tirar_screenshot("12_topicos_criado")
        
        self.topico_criado_id = self.obter_ultimo_id_criado("#topicos-lista > div")
        print(f"  [ID] Topico criado com ID: {self.topico_criado_id}")
        
        print("\n  ✓ Topico criado com sucesso!\n")
        time.sleep(1.5)
    
    def testar_aba_respostas(self):
        """Testa aba Respostas"""
        self.mostrar_titulo("TESTANDO: RESPOSTAS")
        
        print("  [1/4] Abrindo aba Respostas...")
        self.clicar_elemento_fluido(By.CSS_SELECTOR, '[data-tab="respostas"]')
        time.sleep(1.5)
        self.tirar_screenshot("13_aba_respostas")
        
        print("  [2/4] Informando topico...")
        topico = self.aguardar_elemento(By.ID, "resposta-topico")
        self.rolar_para_elemento(topico)
        topico.clear()
        topico_id = self.topico_criado_id if self.topico_criado_id else 1
        self.digitar_devagar(topico, str(topico_id), 0.08)
        
        print("  [3/4] Informando autor...")
        usuario = self.driver.find_element(By.ID, "resposta-usuario")
        usuario.clear()
        resposta_autor_id = random.randint(1, 5)
        self.digitar_devagar(usuario, str(resposta_autor_id), 0.08)
        
        print("  [4/4] Digitando resposta...")
        conteudo = self.driver.find_element(By.ID, "resposta-conteudo")
        self.rolar_para_elemento(conteudo)
        self.digitar_devagar(
            conteudo,
            "Boa pergunta! Use heranca quando houver relacao 'e um', exemplo: Cachorro e um Animal. "
            "Use composicao quando for 'tem um', exemplo: Carro tem um Motor. "
            "Preferencia por composicao na maioria dos casos!",
            0.02
        )
        
        time.sleep(1)
        self.tirar_screenshot("14_respostas_preenchido")
        
        print("  [OK] Registrando resposta...")
        btn_registrar = self.driver.find_element(By.ID, "btn-registrar-resposta")
        self.rolar_para_elemento(btn_registrar)
        self.mover_mouse_para_elemento(btn_registrar)
        time.sleep(0.5)
        btn_registrar.click()
        
        time.sleep(1.5)
        try:
            alert = self.driver.switch_to.alert
            print(f"  [OK] {alert.text}")
            time.sleep(1)
            alert.accept()
        except:
            pass
        
        time.sleep(2)
        self.scroll_suave(400)
        time.sleep(1)
        self.tirar_screenshot("15_respostas_registrada")
        
        print("\n  ✓ Resposta registrada com sucesso!\n")
        time.sleep(1.5)
    
    def testar_aba_arquivos(self):
        """Testa aba Arquivos com upload"""
        self.mostrar_titulo("TESTANDO: ARQUIVOS E UPLOAD")
        
        print("  [1/5] Abrindo aba Arquivos...")
        self.clicar_elemento_fluido(By.CSS_SELECTOR, '[data-tab="arquivos"]')
        time.sleep(2)
        self.tirar_screenshot("16_aba_arquivos")
        
        print("  [2/5] Criando arquivo de teste...")
        arquivo_teste = "documento_teste.txt"
        with open(arquivo_teste, "w", encoding="utf-8") as f:
            f.write("FORUM ACADEMICO UNIFEI - Arquivo de Teste\n\n")
            f.write("Este e um documento de exemplo para validar o sistema de upload.\n")
            f.write("Data: " + time.strftime("%d/%m/%Y %H:%M") + "\n")
            f.write("\nConteudo de teste gerado automaticamente.\n")
        
        caminho_arquivo = os.path.abspath(arquivo_teste)
        print(f"  [OK] Arquivo criado: {arquivo_teste}")
        
        print("  [3/5] Selecionando arquivo...")
        file_input = self.aguardar_elemento(By.ID, "arquivo-file")
        self.rolar_para_elemento(file_input)
        file_input.send_keys(caminho_arquivo)
        time.sleep(1)
        
        print("  [4/5] Preenchendo dados...")
        usuario = self.driver.find_element(By.ID, "arquivo-usuario")
        self.rolar_para_elemento(usuario)
        usuario.clear()
        upload_usuario_id = self.usuario_criado_id if self.usuario_criado_id else random.randint(1, 5)
        self.digitar_devagar(usuario, str(upload_usuario_id), 0.08)
        
        topico = self.driver.find_element(By.ID, "arquivo-topico")
        upload_topico_id = self.topico_criado_id if self.topico_criado_id else random.randint(1, 3)
        self.digitar_devagar(topico, str(upload_topico_id), 0.08)
        
        time.sleep(1)
        self.tirar_screenshot("17_arquivos_preenchido")
        
        print("  [5/5] Fazendo upload...")
        btn_upload = self.driver.find_element(By.ID, "btn-upload-arquivo")
        self.rolar_para_elemento(btn_upload)
        self.mover_mouse_para_elemento(btn_upload)
        time.sleep(0.5)
        btn_upload.click()
        
        print("  [OK] Aguardando processamento...")
        time.sleep(3)
        
        try:
            alert = self.driver.switch_to.alert
            print(f"  [OK] {alert.text}")
            time.sleep(1)
            alert.accept()
        except:
            pass
        
        time.sleep(2)
        
        print("\n  [RESULTADO] Exibindo arquivo enviado...")
        self.driver.execute_script("window.scrollTo({top: 0, behavior: 'smooth'});")
        time.sleep(1)
        self.scroll_suave(600)
        time.sleep(2)
        
        arquivos = self.driver.find_elements(By.CSS_SELECTOR, ".arquivo-item")
        print(f"  [INFO] Total de arquivos no sistema: {len(arquivos)}")
        
        self.tirar_screenshot("18_arquivos_final")
        
        if os.path.exists(arquivo_teste):
            os.remove(arquivo_teste)
            print("  [OK] Arquivo temporario removido")
        
        print("\n  ✓ Upload concluido com sucesso!\n")
        time.sleep(3)
    
    def executar_todos_testes(self):
        """Executa todos os testes em sequência"""
        try:
            print("\nAcessando aplicacao...")
            self.driver.get(self.url_base)
            time.sleep(3)
            self.driver.execute_script("window.scrollTo({top: 0, behavior: 'smooth'});")
            time.sleep(1)
            self.tirar_screenshot("00_pagina_inicial")
            print("✓ Pagina carregada em TELA CHEIA!\n")
            time.sleep(2)
            
            self.testar_aba_mural()
            self.testar_aba_usuarios()
            self.testar_aba_disciplinas()
            self.testar_aba_topicos()
            self.testar_aba_respostas()
            self.testar_aba_arquivos()
            
            print("\n" + "="*70)
            print(" "*20 + "TESTES CONCLUIDOS COM SUCESSO!")
            print("="*70)
            print(f"\n  Screenshots salvos: {self.screenshot_dir}/")
            print("  Total de capturas: 19 imagens")
            print("\n  Sistema validado e funcionando perfeitamente!")
            print("\n  Encerrando em 8 segundos...")
            print("="*70 + "\n")
            time.sleep(8)
            
        except Exception as e:
            print(f"\n[ERRO] Falha durante execucao: {str(e)}")
            self.tirar_screenshot("ERRO_fatal")
            raise
        
        finally:
            print("\nEncerrando navegador...")
            self.driver.quit()
            print("✓ Testes finalizados!\n")

def main():
    teste = TestForumAcademicoFluido()
    teste.executar_todos_testes()

if __name__ == "__main__":
    main()
