// Real Free APIs Configuration
const API_CONFIG = {
    weather: {
        url: 'https://api.openweathermap.org/data/2.5/weather',
        key: 'b1b15e88fa797225412429c1c50c122a1'
    },
    exchange: {
        url: 'https://api.exchangerate-api.com/v4/latest/USD'
    },
    joke: {
        url: 'https://official-joke-api.appspot.com/random_joke'
    },
    quote: {
        url: 'https://api.quotable.io/random'
    },
    news: {
        url: 'https://newsdata.io/api/1/news',
        key: 'pub_6ffc2d1e907241cf9253c3a8aa82f7e9'
    }
};

class AIAssistant {
    constructor() {
        this.services = {
            'weather': (input) => this.getRealWeather(input),
            'news': () => this.getRealMyanmarNews(),
            'exchange': (input) => this.getRealExchangeRates(input),
            'joke': () => this.getRealJoke(),
            'quote': () => this.getRealQuote(),
            'time': () => this.getMyanmarTime(),
            'calc': (input) => this.calculate(input),
            'help': () => this.showMyanmarHelp()
        };

        this.myanmarCities = {
            'ရန်ကုန်': 'Yangon', 'ရန္ကုန္': 'Yangon', 'yangon': 'Yangon',
            'မန္တလေး': 'Mandalay', 'mandalay': 'Mandalay',
            'နေပြည်တော်': 'Naypyidaw', 'naypyidaw': 'Naypyidaw',
            'ပဲခူး': 'Bago', 'bago': 'Bago',
            'မွန်': 'Mawlamyine', 'မော်လမြိုင်': 'Mawlamyine', 'mawlamyine': 'Mawlamyine'
        };
    }

    understandCommand(input) {
        input = input.toLowerCase();
        
        if (input.includes('weather') || input.includes('ရာသီဥတု') || input.includes('မိုး') || input.includes('အပူချိန်')) {
            return 'weather';
        } else if (input.includes('news') || input.includes('သတင်း') || input.includes('ထူးခြားချက်')) {
            return 'news';
        } else if (input.includes('exchange') || input.includes('currency') || input.includes('usd') || input.includes('mmk') || 
                   input.includes('ငွေလဲ') || input.includes('ဒေါ်လာ') || input.includes('ကျပ်')) {
            return 'exchange';
        } else if (input.includes('joke') || input.includes('funny') || input.includes('ဟာသ') || input.includes('ရီစရာ')) {
            return 'joke';
        } else if (input.includes('quote') || input.includes('inspire') || input.includes('စကားစု') || input.includes('အားတက်စရာ')) {
            return 'quote';
        } else if (input.includes('time') || input.includes('အချိန်') || input.includes('နာရီ')) {
            return 'time';
        } else if (input.includes('calculate') || input.includes('တွက်') || input.includes('+') || input.includes('-') || 
                   input.includes('*') || input.includes('/') || input.includes('ဂဏန်း')) {
            return 'calc';
        } else if (input.includes('help') || input.includes('ကူညီ') || input.includes('အကူ')) {
            return 'help';
        } else {
            return 'unknown';
        }
    }

    extractCity(input) {
        for (const [mmCity, engCity] of Object.entries(this.myanmarCities)) {
            if (input.includes(mmCity.toLowerCase()) || input.includes(engCity.toLowerCase())) {
                return engCity;
            }
        }
        return 'Yangon';
    }

    async getRealWeather(input) {
        try {
            const city = this.extractCity(input);
            const cityNames = {
                'Yangon': 'ရန်ကုန်', 'Mandalay': 'မန္တလေး', 'Naypyidaw': 'နေပြည်တော်',
                'Bago': 'ပဲခူး', 'Mawlamyine': 'မော်လမြိုင်'
            };

            const response = await fetch(
                `${API_CONFIG.weather.url}?q=${city}&appid=${API_CONFIG.weather.key}&units=metric`
            );
            
            if (!response.ok) throw new Error('Weather API failed');
            
            const data = await response.json();
            const temp = Math.round(data.main.temp);
            const desc = data.weather[0].description;
            const humidity = data.main.humidity;
            const feelsLike = Math.round(data.main.feels_like);
            const mmCityName = cityNames[city] || city;

            const weatherTranslations = {
                'clear sky': 'ကောင်းကင်ပြင့်', 'few clouds': 'တိမ်အနည်းငယ်',
                'scattered clouds': 'တိမ်များပြားနေ', 'broken clouds': 'တိမ်ထူထပ်နေ',
                'overcast clouds': 'တိမ်ဖုံးနေ', 'light rain': 'မိုးအနည်းငယ်',
                'moderate rain': 'မိုးအသင့်အတင့်', 'heavy intensity rain': 'မိုးသည်းထန်စွာ'
            };

            const mmDesc = weatherTranslations[desc] || desc;

            return `🌤️ <strong>${mmCityName} မြို့ ရာသီဥတု</strong>
<div class="api-result">
📍 အပူချိန်: <strong>${temp}°C</strong><br>
📝 ခံစားရအပူချိန်: <strong>${feelsLike}°C</strong><br>
🌦️ ရာသီဥတု: ${mmDesc}<br>
💧 စိုထိုင်းဆ: ${humidity}%<br>
🌍 နိုင်ငံ: ${data.sys.country}
</div>
<small><em>OpenWeatherMap မှ လက်ရှိဒေတာ</em></small>`;
        } catch (error) {
            return `<div class="error-message">🌤️ ရာသီဥတုဒေတာ ယူလို့မရသေးပါ။ ကျေးဇူးပြု၍ နောက်မှထပ်ကြိုးစားကြည့်ပါ။</div>`;
        }
    }

    async getRealMyanmarNews() {
        try {
            const response = await fetch(
                `${API_CONFIG.news.url}?apikey=${API_CONFIG.news.key}&country=mm&language=my&category=technology,health`
            );
            
            if (!response.ok) throw new Error('News API failed');
            
            const data = await response.json();
            
            if (!data.results || data.results.length === 0) {
                return this.getFallbackMyanmarNews();
            }
            
            let newsHTML = '<strong>📰 နောက်ဆုံးရ မြန်မာသတင်းများ</strong><div class="api-result">';
            
            data.results.slice(0, 5).forEach((article) => {
                const title = article.title || 'သတင်းခေါင်းစဉ်';
                newsHTML += `• ${title}<br>`;
            });
            
            newsHTML += '</div><small><em>NewsData.io မှ လက်ရှိသတင်းများ</em></small>';
            return newsHTML;
            
        } catch (error) {
            return this.getFallbackMyanmarNews();
        }
    }

    getFallbackMyanmarNews() {
        const myanmarNews = [
            "မြန်မာနိုင်ငံတွင် ဒစ်ဂျစ်တယ်စီးပွားရေး လျင်မြန်စွာ ကြီးထွားလျက်ရှိ",
            "ပညာရေးစနစ် ခေတ်မီအောင် ဆောင်ရွက်လျက်ရှိ",
            "နည်းပညာတက္ကသိုလ်များ ဖွံ့ဖြိုးတိုးတက်လာ",
            "AI နည်းပညာ မြန်မာပြည်တွင် စတင်အသုံးပြုလာ"
        ];

        let newsHTML = '<strong>📰 နောက်ဆုံးရ သတင်းများ</strong><div class="api-result">';
        myanmarNews.forEach(news => newsHTML += `• ${news}<br>`);
        newsHTML += '</div><small><em>မြန်မာသတင်းများ</em></small>';
        return newsHTML;
    }

    async getRealExchangeRates(input) {
        try {
            const response = await fetch(API_CONFIG.exchange.url);
            if (!response.ok) throw new Error('Exchange API failed');
            
            const data = await response.json();
            const rates = data.rates;
            const mmk = rates.MMK ? rates.MMK.toFixed(2) : 'N/A';
            const eur = rates.EUR ? rates.EUR.toFixed(2) : 'N/A';
            const sgd = rates.SGD ? rates.SGD.toFixed(2) : 'N/A';
            const thb = rates.THB ? rates.THB.toFixed(2) : 'N/A';
            
            return `💱 <strong>လက်ရှိ ငွေလဲနှုန်းများ (USD 1 ဒေါ်လာအတွက်)</strong>
<div class="api-result">
🇲🇲 မြန်မာကျပ်: <strong>${mmk} MMK</strong><br>
🇪🇺 ယူရို: <strong>${eur} EUR</strong><br>
🇸🇬 စင်္ကာပူဒေါ်လာ: <strong>${sgd} SGD</strong><br>
🇹🇭 ထိုင်းဘတ်: <strong>${thb} THB</strong>
</div>
<small><em>ExchangeRate-API မှ လက်ရှိဒေတာ</em></small>`;
        } catch (error) {
            return `<div class="error-message">💱 ငွေလဲနှုန်း ဝန်ဆောင်မှု ယာယီရပ်ဆိုင်းနေပါသည်။</div>`;
        }
    }

    async getRealJoke() {
        try {
            const response = await fetch(API_CONFIG.joke.url);
            if (!response.ok) throw new Error('Joke API failed');
            
            const joke = await response.json();
            const jokeTranslations = {
                "Why did the chicken cross the road?": "ဘာကြောင့် ကြက်တွေက လမ်းကိုဖြတ်ကြတာလဲ?",
                "To get to the other side!": "အခြားဘက်ခြမ်းကိုရောက်ဖို့ပါ!"
            };

            const setup = jokeTranslations[joke.setup] || joke.setup;
            const punchline = jokeTranslations[joke.punchline] || joke.punchline;

            return `😄 <strong>ဟာသ</strong>
<div class="api-result">
"${setup}"<br>
<strong>${punchline}</strong>
</div>
<small><em>Official Joke API မှ</em></small>`;
        } catch (error) {
            return this.getFallbackMyanmarJoke();
        }
    }

    getFallbackMyanmarJoke() {
        const myanmarJokes = [
            "ဘာကြောင့် ကွန်ပျူတာတွေက ဘာသာစကားအသစ်တွေ သင်ရတာ ကြောက်တာလဲ? \nဘာလို့လဲဆိုတော့... သူတို့မှာ ဘာဂါ(bug)တွေ ရှိနေလို့ပါ!",
            "ပရိုဂရမ်မာတစ်ယောက် ရေခဲသေတ္တာထဲမှာ ဘာကြောင့်ဝင်နေတာလဲ? \nဘာလို့လဲဆိုတော့... သူက console.log() လုပ်ချင်နေလို့ပါ!"
        ];

        const randomJoke = myanmarJokes[Math.floor(Math.random() * myanmarJokes.length)];
        const [setup, punchline] = randomJoke.split('\n');

        return `😄 <strong>မြန်မာဟာသ</strong>
<div class="api-result">
${setup}<br>
<strong>${punchline}</strong>
</div>
<small><em>မြန်မာဟာသများ</em></small>`;
    }

    async getRealQuote() {
        try {
            const response = await fetch(API_CONFIG.quote.url);
            if (!response.ok) throw new Error('Quote API failed');
            
            const quote = await response.json();
            const quoteTranslations = {
                "The way to get started is to quit talking and begin doing.": "စတင်ခြင်းရဲ့နည်းလမ်းက စကားပြောတာရပ်ပြီး လက်တွေ့လုပ်ဖို့ပါ။",
                "The future belongs to those who believe in the beauty of their dreams.": "အနာဂတ်က သူတို့ရဲ့အိပ်မက်တွေရဲ့ အလှတရားကို ယုံကြည်သူတွေအတွက်ပါ။"
            };

            const myanmarQuote = quoteTranslations[quote.content] || quote.content;

            return `💫 <strong>စိတ်ဓာတ်တက်ကြွစေသော စကားစု</strong>
<div class="api-result">
"${myanmarQuote}"<br>
- <strong>${quote.author}</strong>
</div>
<small><em>Quotable API မှ</em></small>`;
        } catch (error) {
            return "💫 'ကြိုးစားအားထုတ်မှုရဲ့ တစ်ခုတည်းသောနည်းလမ်းက ချစ်တဲ့အလုပ်ကိုလုပ်ဖို့ပါ' - စတိဗ်ဂျော့စ်";
        }
    }

    getMyanmarTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: 'Asia/Yangon'
        };
        
        const myanmarTime = now.toLocaleDateString('my-MM', options);
        return `⏰ <strong>မြန်မာစံတော်ချိန်</strong><br>${myanmarTime}`;
    }

    calculate(input) {
        try {
            const expression = input.replace(/[^0-9+\-*/().]/g, '');
            if (expression) {
                const result = eval(expression);
                return `🧮 <strong>တွက်ချက်မှုရလဒ်</strong><br>${expression} = <strong>${result}</strong>`;
            }
            return "🧮 ကျေးဇူးပြု၍ '၂+၂' သို့မဟုတ် '၁၀×၅' ကဲ့သို့ တွက်ချက်မှုတစ်ခုပေးပါ";
        } catch (e) {
            return "🧮 ကျေးဇူးပြု၍ ထိုတွက်ချက်မှုကို တွက်ချက်နိုင်ခြင်းမရှိပါ";
        }
    }

    showMyanmarHelp() {
        return `🤖 <strong>ကျွန်တော် ကူညီပေးနိုင်တာတွေ:</strong>
<div class="api-result">
🌤️ <strong>ရာသီဥတု</strong> - "ရန်ကုန်ရာသီဥတု", "မန္တလေးမိုး"<br>
📰 <strong>သတင်းများ</strong> - "သတင်းတွေပြောပါ", "နောက်ဆုံးရသတင်း"<br>
💱 <strong>ငွေလဲနှုန်း</strong> - "ဒေါ်လာကျပ် ငွေလဲနှုန်း"<br>
😄 <strong>ဟာသများ</strong> - "ဟာသတစ်ခုပြောပါ", "ရီစရာပြောပါ"<br>
💫 <strong>စကားစုများ</strong> - "စကားစုပြောပါ", "အားတက်စရာပြောပါ"<br>
⏰ <strong>လက်ရှိအချိန်</strong> - "အချိန်ဘယ်လောက်ရှိပြီလဲ"<br>
🧮 <strong>တွက်ချက်မှုများ</strong> - "၁၅×၃ တွက်ပေးပါ", "၂+၂ တွက်ပြပါ"<br>
</div>
<small><em>လက်ရှိ API ဒေတာများ • ၁၀၀% အခမဲ့</em></small>`;
    }

    async process(input) {
        const command = this.understandCommand(input);
        if (command in this.services) {
            return await this.services[command](input);
        } else {
            return this.showMyanmarHelp();
        }
    }
}

class ChatApp {
    constructor() {
        this.ai = new AIAssistant();
        this.chatContainer = document.getElementById('chatContainer');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.init();
    }
    
    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.setupPWA();
    }
    
    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        this.userInput.value = '';
        this.showTyping();
        
        try {
            const response = await this.ai.process(message);
            this.hideTyping();
            this.addMessage(response, 'ai');
        } catch (error) {
            this.hideTyping();
            this.addMessage("<div class='error-message'>တောင်းပန်ပါတယ်၊ အမှားတစ်ခုဖြစ်သွားပါတယ်။ ကျေးဇူးပြု၍ ထပ်ကြိုးစားကြည့်ပါ။</div>", 'ai');
        }
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${sender === 'ai' ? 'mm-text' : ''}`;
        bubble.innerHTML = text;
        
        messageDiv.appendChild(bubble);
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `<div class="message-bubble mm-text"><div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
        this.chatContainer.appendChild(typingDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) typingIndicator.remove();
    }
    
    setupPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('SW registered'))
                .catch(() => console.log('SW registration failed'));
        }
        
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            const installPrompt = document.getElementById('installPrompt');
            const installBtn = document.getElementById('installButton');
            const cancelBtn = document.getElementById('cancelInstall');
            
            installPrompt.style.display = 'flex';
            
            installBtn.onclick = () => {
                installPrompt.style.display = 'none';
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(() => deferredPrompt = null);
            };
            
            cancelBtn.onclick = () => installPrompt.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new ChatApp());