
document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.getElementById('news-list');
  const destaqueImg = document.getElementById('img-destaque');
  const destaqueResumo = document.getElementById('resumo-destaque');
  const destaqueTitulo = document.getElementById('titulo-destaque');
  const proxBtn = document.getElementById('prox');
  const climaEl = document.getElementById('clima');
  const themeBtn = document.getElementById('toggle-theme');
  const body = document.body;

  let noticias = [];
  let destaqueIndex = 0;

  const carregarNoticias = () => {
    if (!newsContainer) return;

    newsContainer.innerHTML = Array(6).fill().map(() => `
      <div class="news-item skeleton-load">
        <div class="skeleton-image"></div>
        <div class="skeleton-text">
          <div class="skeleton-line" style="width: 80%;"></div>
          <div class="skeleton-line" style="width: 95%;"></div>
          <div class="skeleton-line" style="width: 60%;"></div>
        </div>
      </div>
    `).join('');

    const newsApiKey = 'pub_7dc6736837774e3a936242073fd6513a';
    const query = 'esportes';

    fetch(`https://newsdata.io/api/1/latest?apikey=${newsApiKey}&q=${encodeURIComponent(query)}&language=pt`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          noticias = data.results.filter(article => article.title || article.description);

          if (noticias.length === 0) {
            newsContainer.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
            return;
          }

          destaqueIndex = 0;
          atualizarDestaque();

          newsContainer.innerHTML = noticias.map(article => {
            const resumo = article.description
              ? (article.description.length > 150
                ? article.description.substring(0, 150) + '...'
                : article.description)
              : 'Nenhuma descrição disponível.';

            return `
              <div class="news-item">
                <img src="${article.image_url || 'https://via.placeholder.com/200x120.png?text=Sem+Imagem'}" 
                     alt="${article.title}" 
                     onerror="this.src='https://via.placeholder.com/200x120.png?text=Sem+Imagem'">
                <div class="news-content">
                  <h3>${article.title}</h3>
                  <p>${resumo}</p>
                  <a href="${article.link}" class="ler-mais" target="_blank">Ler mais</a>
                </div>
              </div>
            `;
          }).join('');

        } else {
          newsContainer.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
        }
      })
      .catch(err => {
        console.error('Erro ao buscar notícias:', err);
        newsContainer.innerHTML = '<p>Erro ao carregar notícias.</p>';
      });
  };

  const atualizarDestaque = () => {
    if (noticias.length === 0) return;
    const artigo = noticias[destaqueIndex];
    destaqueImg.src = artigo.image_url || 'https://via.placeholder.com/800x400';
    destaqueImg.alt = artigo.title;
    destaqueResumo.textContent = artigo.description || 'Nenhuma descrição disponível.';
    destaqueTitulo.textContent = artigo.title;
  };

  if (proxBtn) {
    proxBtn.addEventListener('click', () => {
      if (noticias.length === 0) return;
      destaqueIndex = (destaqueIndex + 1) % noticias.length;
      atualizarDestaque();
    });
  }

  const carregarClima = () => {
    if (!climaEl) return;

    const apiKey = "1fc113809b01a3bfb3945794441c67fb"; // 🔑 sua chave OpenWeather
    const cidade = "Sao Paulo,BR";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`)
      .then(res => {
        if (!res.ok) throw new Error("Falha na API do clima");
        return res.json();
      })
      .then(data => {
        const temp = Math.round(data.main.temp);
        const condicao = data.weather[0].description;
        climaEl.textContent = `${temp}°C - ${condicao}`;
      })
      .catch(err => {
        console.error("Erro ao buscar clima:", err);
        climaEl.textContent = "Clima indisponível no momento.";
      });
  };

  carregarNoticias();
  carregarClima();

  setInterval(carregarNoticias, 120000);
  setInterval(carregarClima, 300000);

  function toggleTheme() {
    const isLight = body.classList.toggle('light-mode');
    themeBtn.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }

  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeBtn.textContent = '🌙';
  } else {
    body.classList.remove('light-mode');
    themeBtn.textContent = '☀️';
  }

  themeBtn.addEventListener('click', toggleTheme);

  const abrirAssistente = document.getElementById('abrir-assistente');
  const fecharAssistente = document.getElementById('fechar-assistente');
  const assistenteChat = document.getElementById('assistente-chat');
  const assistenteForm = document.getElementById('assistente-form');
  const assistenteInput = document.getElementById('assistente-input');
  const assistenteMensagens = document.getElementById('assistente-mensagens');
  const limparAssistente = document.getElementById('limpar-assistente');

  if (abrirAssistente && fecharAssistente && assistenteChat) {
    abrirAssistente.onclick = () => {
      assistenteChat.style.display = 'flex';
      abrirAssistente.style.display = 'none';
    };
    fecharAssistente.onclick = () => {
      assistenteChat.style.display = 'none';
      abrirAssistente.style.display = 'block';
    };
    assistenteForm.onsubmit = (e) => {
      e.preventDefault();
      const msg = assistenteInput.value.trim();
      if (!msg) return;
      const userMsg = document.createElement('div');
      userMsg.className = 'assistente-msg assistente-user';
      userMsg.textContent = msg;
      assistenteMensagens.appendChild(userMsg);
      assistenteInput.value = '';
      assistenteMensagens.scrollTop = assistenteMensagens.scrollHeight;

      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'assistente-msg assistente-bot';
        botMsg.textContent = gerarRespostaAssistente(msg);
        assistenteMensagens.appendChild(botMsg);
        assistenteMensagens.scrollTop = assistenteMensagens.scrollHeight;
      }, 700);
    };
  }

  if (limparAssistente && assistenteMensagens) {
    limparAssistente.onclick = () => {
      assistenteMensagens.innerHTML = '<div class="assistente-msg assistente-bot">Olá! Como posso ajudar você hoje?</div>';
    };
  }

  function gerarRespostaAssistente(pergunta) {
    const texto = pergunta.toLowerCase();

    const nomeAssistente = "Loba";
    const emoji = "🦉";

    if (texto.includes('clima') || texto.includes('tempo')) {
      return `${emoji} Aqui está o clima agora: ${document.getElementById('clima')?.textContent || 'Ops! Não consegui pegar o clima.'}`;
    }
    if (texto.includes('notícia') || texto.includes('noticias') || texto.includes('futebol') || texto.includes('fórmula') || texto.includes('volei')) {
      return `${emoji} Adoro esportes! Veja as últimas novidades na seção "Últimas" do portal. Se quiser saber de algum esporte específico, só pedir!`;
    }
    if (texto.includes('tema') || texto.includes('escuro') || texto.includes('claro')) {
      return `${emoji} Quer mudar o visual? É só clicar no botão de lua/sol lá em cima!`;
    }
    if (texto.includes('olá') || texto.includes('oi')) {
      return `${emoji} Olá! Eu sou a ${nomeAssistente}, sua assistente virtual. Como posso te ajudar hoje?`;
    }
    if (texto.includes('horário') || texto.includes('hora')) {
      const agora = new Date();
      return `${emoji} Agora são ${agora.getHours()}:${String(agora.getMinutes()).padStart(2, '0')}. Precisa de algo mais?`;
    }
    if (texto.includes('ajuda') || texto.includes('suporte')) {
      return `${emoji} Pode perguntar sobre clima, notícias, tema ou navegação. Estou aqui para facilitar sua vida!`;
    }
    if (texto.includes('obrigado') || texto.includes('valeu')) {
      return `${emoji} Imagina! Fico feliz em ajudar 😊`;
    }
    return `${emoji} Hmmm... não entendi muito bem. Mas pode perguntar sobre clima, notícias, tema ou navegação!`;
  }
});
