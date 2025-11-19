// Sistema de autenticacao e permissoes
(function() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    // Se nao estiver logado, redirecionar para login
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    
    console.log('Usuario logado:', usuario);
    
    // Definir permissoes por tipo de usuario
    const permissoes = {
        'Administrador': {
            abas: ['mural', 'usuarios', 'disciplinas', 'topicos', 'respostas', 'arquivos']
        },
        'Professor': {
            abas: ['mural', 'disciplinas', 'topicos', 'respostas', 'arquivos']
        },
        'Aluno': {
            abas: ['mural', 'disciplinas', 'topicos', 'respostas', 'arquivos']
        },
        'Monitor': {
            abas: ['mural', 'disciplinas', 'topicos', 'respostas', 'arquivos']
        }
    };
    
    const userPermissoes = permissoes[usuario.tipo] || permissoes['Aluno'];
    console.log('Permissoes:', userPermissoes);
    
    // APLICAR PERMISSOES IMEDIATAMENTE QUANDO DOM CARREGAR
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
    
    function inicializar() {
        console.log('Inicializando permissoes...');
        aplicarPermissoes();
        adicionarInfoUsuario();
        adicionarBotaoLogout();
    }
    
    function aplicarPermissoes() {
        // Lista de todas as abas
        const todasAbas = ['mural', 'usuarios', 'disciplinas', 'topicos', 'respostas', 'arquivos'];
        
        console.log('Aplicando permissoes de abas...');
        
        todasAbas.forEach(aba => {
            const tabElement = document.querySelector(`[data-tab="${aba}"]`);
            
            if (tabElement) {
                if (userPermissoes.abas.includes(aba)) {
                    // MOSTRAR ABA
                    tabElement.style.display = 'inline-block';
                    tabElement.style.visibility = 'visible';
                    tabElement.parentElement.style.display = 'inline-block';
                    console.log(`✓ Aba ${aba}: VISIVEL`);
                } else {
                    // OCULTAR ABA
                    tabElement.style.display = 'none';
                    console.log(`✗ Aba ${aba}: OCULTA`);
                }
            } else {
                console.warn(`Aba ${aba} nao encontrada no DOM`);
            }
        });
        
        // Aplicar permissoes de formularios e botoes (com delay)
        setTimeout(aplicarPermissoesFormularios, 100);
    }
    
    function aplicarPermissoesFormularios() {
        console.log('Aplicando permissoes de formularios...');
        
        const ehAdmin = usuario.tipo === 'Administrador';
        const ehProfessor = usuario.tipo === 'Professor';
        const ehMonitor = usuario.tipo === 'Monitor';
        const ehAluno = usuario.tipo === 'Aluno';
        
        // USUARIOS - apenas admin
        if (!ehAdmin) {
            ocultarElemento('#form-usuario');
            ocultarBotoes('#usuarios-lista .btn-delete');
        }
        
        // DISCIPLINAS - apenas admin pode editar
        if (!ehAdmin) {
            ocultarElemento('#form-disciplina');
            ocultarBotoes('#disciplinas-lista .btn-delete');
        }
        
        // RECADOS - admin, professor e monitor podem criar
        if (ehAluno) {
            ocultarElemento('#form-recado');
        }
        
        // DELETE DE RECADOS - apenas admin
        if (!ehAdmin) {
            ocultarBotoes('#recados-lista .btn-delete');
        }
        
        // DELETE DE TOPICOS - apenas admin
        if (!ehAdmin) {
            ocultarBotoes('#topicos-lista .btn-delete');
        }
        
        // DELETE DE RESPOSTAS - apenas admin
        if (!ehAdmin) {
            ocultarBotoes('#respostas-lista .btn-delete');
        }
        
        // DELETE DE ARQUIVOS - apenas admin
        if (!ehAdmin) {
            ocultarBotoes('.arquivo-item .btn-delete');
        }
    }
    
    function ocultarElemento(seletor) {
        const elemento = document.querySelector(seletor);
        if (elemento) {
            elemento.style.display = 'none';
            console.log(`Elemento ${seletor} ocultado`);
        }
    }
    
    function ocultarBotoes(seletor) {
        const botoes = document.querySelectorAll(seletor);
        botoes.forEach(btn => {
            btn.style.display = 'none';
        });
        if (botoes.length > 0) {
            console.log(`${botoes.length} botoes ${seletor} ocultados`);
        }
    }
    
    function adicionarInfoUsuario() {
        const subtitle = document.querySelector('.header .subtitle');
        if (subtitle && usuario) {
            const icones = {
                'Administrador': '👤 [ADMIN]',
                'Professor': '👨‍🏫 [PROF]',
                'Aluno': '🎓 [ALUNO]',
                'Monitor': '📚 [MONITOR]'
            };
            const icone = icones[usuario.tipo] || '';
            subtitle.innerHTML = `${icone} ${usuario.nome}`;
            subtitle.style.fontWeight = '600';
            subtitle.style.fontSize = '14px';
        }
    }
    
    function adicionarBotaoLogout() {
        const header = document.querySelector('.header .container');
        if (header && !document.getElementById('btn-logout')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'btn-logout';
            logoutBtn.innerHTML = '🚪 Sair';
            logoutBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                padding: 10px 20px;
                background: rgba(255,255,255,0.2);
                color: white;
                border: 2px solid white;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.2s;
                z-index: 9999;
            `;
            
            logoutBtn.addEventListener('mouseover', () => {
                logoutBtn.style.background = 'white';
                logoutBtn.style.color = '#003d7a';
            });
            
            logoutBtn.addEventListener('mouseout', () => {
                logoutBtn.style.background = 'rgba(255,255,255,0.2)';
                logoutBtn.style.color = 'white';
            });
            
            logoutBtn.addEventListener('click', () => {
                if (confirm('Deseja realmente sair do sistema?')) {
                    localStorage.removeItem('usuario');
                    window.location.href = 'login.html';
                }
            });
            
            header.style.position = 'relative';
            header.appendChild(logoutBtn);
        }
    }
    
    // Expor funcoes globais
    window.getUsuarioLogado = function() {
        return usuario;
    };
    
    window.getPermissoes = function() {
        return userPermissoes;
    };
    
    window.podeExecutarAcao = function(acao) {
        return userPermissoes[acao] || false;
    };
})();
