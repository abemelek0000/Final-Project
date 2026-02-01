const poemSubmissionForm = document.getElementById('poem-submission-form');
const mesobPoemGrid = document.getElementById('mesob-poem');
const filterBtns = document.querySelectorAll('.filter-btn');

const poemsData = [
    {
        id: 1,
        title: "ርዕስ የለውም",
        content: `ሐዘንተኛው ልብሽ ፤ በጥርሶችሽ ታንቆ
አንቺን ነው ሚያሳየኝ ፤
ከአዝማሪው ሆድ ላይ ፤ የማየው መሰንቆ።
      እቴ...
መስታወት ዐትዪ ፧ መሰንቆ ነው መልክሽ፧
ቀሚስ አትለኪ ፤ ሰካራም ነው ልክሽ።
ሰካራም ያው ሰው ነው፤
አዝማሪሞ ያው ሰው ነው፤
መሰንቆሞ ያው ሰው ነው፤
ከመሰንቆ ጎጆ ፤ ተጉዘው ሲደርሱ፧
ከመሰንቆ ሰፈር ፤ ተጉዘው ሲደርሱ፧
ከመሰንቆ ሀገር ፤ ተወልደው ሲወርሱ፤
መገዝገዝ ልማድ ነው ፤ አንዴ አስኪ.. …በጠሱ።`,
        author: {
            name: "ኤልያስ ሽታሁን",
            initials: "ኤል",
            color: "#834000"
        },
        likes: 142,
        liked: false,
        saved: false,
        date: "2023-09-15",
        fromSubmission: false
    },
    {
        id: 2,
        title: "ህልሜን አደራ",
        content: `ባይመረመሬ፥ ጥበብ ተሽቀርቅሮ
ከወርቃማ ብርሃን፥ ከብርማ ጸዳል 
የተሠራ ሸማ፥ ማግኘት ብችል ኖሮ 
ከውብ እግሮችሽ ሥር፥ እዘረጋው ነበር
ግና ምንም የለኝ፥ ከህልሞቼ በቀር፤

የኔ ውድ እንግዲህ 
ህልሜን እግሮችሽ ሥር፥ ከዘረጋሁ ወዲህ 
ዝግ ብለሽ እርገጪ፥ ዝግ ብለሽ ሂጂ 
ህልሜ ላይ ነውና፥ የምትራመጂ።`,
        author: {
            name: "በእውቀቱ ስዩም",
            initials: "በስ",
            color: "#45535A"
        },
        likes: 218,
        liked: true,
        saved: true,
        date: "2023-08-22",
        fromSubmission: false
    },
    {
        id: 3,
        title: "መሸ ደሞ አምባ ልውጣ!",
        content: `አምባ ወጥቼ እኩለ-ሌት፥ ስለት ገብቼ በስሟ 
ከርሞ ስይጣን በሷ አስቶኝ፥ ልገላገል ከሕመሟ 
ጠበሏ አፋፍ በጨረቃ፥ ደጋግሜ፥ ማሕሌት ቆሜ 
ሆዴ ቃትቶ ባር ባር ብሎ፥ እርቃኔን ከሷ ታድሜ 
ደጀ ሰላሟን በአራት እግር፥ ተንበርክኬ ተሳልሜ 
በሥጋዬ እሚነደውን፥ በጸሎት ላቤ አጣጥሜ 
እፎይ ብዬ አመስግኜ፥ ውዳሴዋን ደጋግሜ ... 
ገና ከደጅዋ እልፍ ሳልል፥ ደሞ ይምጣ የቁም ሕልሜ? 
ሌት በጥምቀቷ የነጣው፥ ነጋ፥ ደፈረስ ደሜ። 
ለሷ እንጂ ለኔ አልያዘልኝ፥ አዬ የስለት አታምጣ!
በውጣ ውረድ በጠበል፥ ባሣር ወዜ ቢገረጣ 
ልክፍቷ እንደሁ አልለቀቀኝ፥ መሸ ደሞ አምባ ልውጣ!`,
        author: {
            name: "ሎሬት ፅጋዬ ገብረመድህን",
            initials: "ፅገ",
            color: "#748485"
        },
        likes: 89,
        liked: false,
        saved: false,
        date: "2023-10-05",
        fromSubmission: false
    }
];

document.addEventListener('DOMContentLoaded', function() {
    if (mesobPoemGrid) {
        loadPoems('main');
    }
    setupEventListeners();
});

function setupMobileMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('header nav');
    
    if (header && nav) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.setAttribute('aria-label', 'ማውጫ');

        header.appendChild(mobileMenuBtn);
 
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('show');
            this.innerHTML = nav.classList.contains('show') ? '✕' : '☰';
        });
 
        document.addEventListener('click', function(event) {
            if (!header.contains(event.target) && nav.classList.contains('show')) {
                nav.classList.remove('show');
                mobileMenuBtn.innerHTML = '☰';
            }
        });
     nav.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                nav.classList.remove('show');
                mobileMenuBtn.innerHTML = '☰';
            }
        });
    window.addEventListener('resize', function() {
            if (window.innerWidth >= 768 && nav.classList.contains('show')) {
                nav.classList.remove('show');
                mobileMenuBtn.innerHTML = '☰';
            }
        });
    }
}

function setupEventListeners() {
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter= this.getAttribute('data-filter');
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                loadPoems(filter);
            });
        });
    }
    if (poemSubmissionForm) {
        poemSubmissionForm.addEventListener('submit', handlePoemSubmission);
    }
    
    setupEventDelegation();
}

function setupEventDelegation() {
    if (mesobPoemGrid) {
        mesobPoemGrid.addEventListener('click', function(e) {
            if (e.target.closest('.like-btn')) {
                const likeBtn = e.target.closest('.like-btn');
                toggleLike(likeBtn);
            }
            
            if (e.target.closest('.save-btn')) {
                const saveBtn = e.target.closest('.save-btn');
                toggleSave(saveBtn);
            }
            if (e.target.closest('.read-more-btn')) {
                const readMoreBtn = e.target.closest('.read-more-btn');
                togglePoemReadMore(readMoreBtn);
            }
        });
    }
}

function loadPoems(filter) {
    if (!mesobPoemGrid) return;
    mesobPoemGrid.innerHTML = '';
    const allPoems = getAllPoems();
    let filteredPoems = allPoems;
    
    if (filter === 'submitted') {
        filteredPoems = allPoems.filter(poem => poem.fromSubmission);
    }
     if (filteredPoems.length === 0) {
        mesobPoemGrid.innerHTML = `
            <div class="no-poems-message">
                <h3>ግጥም አልተገኘም</h3>
                <p>${filter === 'submitted' ? 'እስካሁን የተላኩ ግጥሞች የሉም። የመጀመሪያ የሚሆኑት እርስዎ ይሁኑ!' : 'ግጥሞች አልተገኙም።'}</p>
            </div>
        `;
    } else {
        filteredPoems.forEach(poem => {
            const poemCard = createPoemCard(poem);
            mesobPoemGrid.appendChild(poemCard);
        });
    }
}
function getAllPoems() {
      let allPoems = [...poemsData];
    
    const submittedPoems = JSON.parse(localStorage.getItem('submittedPoems')) || [];
    
    allPoems = [...submittedPoems, ...allPoems];
    
    return allPoems;
}

function createPoemCard(poem) {
    const card = document.createElement('div');
    card.className = 'poem-card';
    card.setAttribute('data-id', poem.id);
    const poemDate = new Date(poem.date);
    const formattedDate = poemDate.toLocaleDateString('am-ET', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
  const poemLines = poem.content.split('\n');
    const previewLines = poemLines.slice(0, 4).join('\n');
    const fullContent = poem.content;
     const needsReadMore = poemLines.length > 4;
     const userSubmittedBadge = poem.fromSubmission ? '<span class="user-submitted">(ከናንት ለኛ)</span>' : '';
    
    card.innerHTML = `
        <div class="poem-card-header">
            <div class="user-avatar" style="background-color: ${poem.author.color}">
                ${poem.author.initials}
            </div>
            <div class="user-info">
                <h4>${poem.author.name}</h4>
                <p>${formattedDate} ${userSubmittedBadge}</p>
            </div>
        </div>
        <div class="poem-card-body">
            <h3>${poem.title || "ርዕስ የለውም"}</h3>
            <div class="poem-content">
                <pre class="poem-preview">${previewLines}</pre>
                ${needsReadMore ? `<pre class="poem-full-content" style="display: none;">${fullContent}</pre>` : `<pre class="poem-full-content">${fullContent}</pre>`}
            </div>
            ${needsReadMore ? `<button class="read-more-btn">ተጨማሪ አንብብ <i class="fas fa-chevron-down"></i></button>` : ''}
        </div>
        <div class="poem-card-footer">
            <div class="poem-actions">
                <button class="like-btn ${poem.liked ? 'active' : ''}" data-id="${poem.id}">
                    <i class="fas fa-heart"></i>
                    <span>${poem.likes}</span>
                </button>
                <button class="save-btn ${poem.saved ? 'active' : ''}" data-id="${poem.id}">
                    <i class="fas fa-bookmark"></i>
                    <span>አስቀምጥ</span>
                </button>
            </div>
        </div>
    `;
    
    return card;
}
function toggleLike(likeBtn) {
    const poemId = parseInt(likeBtn.getAttribute('data-id'));
    const allPoems = getAllPoems();
    const poemIndex = allPoems.findIndex(p => p.id === poemId);
    
    if (poemIndex !== -1) {
        const poem = allPoems[poemIndex];
       poem.liked = !poem.liked;
         if (poem.liked) {
            poem.likes += 1;
        } else {
            poem.likes -= 1;
        }
        likeBtn.classList.toggle('active');
         const likeCount = likeBtn.querySelector('span');
        likeCount.textContent = poem.likes;
          if (poem.fromSubmission) {
            updateSubmittedPoem(poem);
        }
        
    }
}

function toggleSave(saveBtn) {
    const poemId = parseInt(saveBtn.getAttribute('data-id'));
    const allPoems = getAllPoems();
    const poemIndex = allPoems.findIndex(p => p.id === poemId);
    
    if (poemIndex !== -1) {
        const poem = allPoems[poemIndex];
          poem.saved = !poem.saved;
        saveBtn.classList.toggle('active');
         if (poem.fromSubmission) {
            updateSubmittedPoem(poem);
        }
    }
}

function togglePoemReadMore(readMoreBtn) {
    const poemCard = readMoreBtn.closest('.poem-card');
    const fullContent = poemCard.querySelector('.poem-full-content');
    const preview = poemCard.querySelector('.poem-preview');
    
    if (fullContent.style.display === 'none' || fullContent.style.display === '') {
           preview.style.display = 'none';
        fullContent.style.display = 'block';
        readMoreBtn.innerHTML = 'ተመለስ <i class="fas fa-chevron-up"></i>';
        readMoreBtn.classList.add('expanded');
    } else {
         preview.style.display = 'block';
        fullContent.style.display = 'none';
        readMoreBtn.innerHTML = 'ሙሉውን ላንብብ <i class="fas fa-chevron-down"></i>';
        readMoreBtn.classList.remove('expanded');
    }
}


function handlePoemSubmission(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const title = document.getElementById('title').value.trim();
    const poemContent = document.getElementById('poem').value.trim();
    
    if (!name || !email || !poemContent) {
        showNotification('እባክዎ ሁሉንም አስፈላጊ መረጃዎች ያስገቡ!');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ!');
        return;
    }
    
    const newPoem = {
        id: Date.now(), 
        title: title || "----",
        content: poemContent,
        author: {
            name: name,
            initials: getInitials(name),
            color: getRandomColor()
        },
        category: "ከናንት ለኛ",
        likes: 0,
        liked: false,
        saved: false,
        date: new Date().toISOString(),
        email: email,
        fromSubmission: true
    };
   
    saveSubmittedPoem(newPoem);
    showNotification('ግጥምዎ በተሳካ ሁኔታ ተልኳል! አሁን በመሶብ ገፅ ላይ ይታያል።');
     poemSubmissionForm.reset();
    if (mesobPoemGrid) {
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            const filter = activeFilter.getAttribute('data-filter');
            loadPoems(filter);
        }
    }
}

function saveSubmittedPoem(poem) {
   
    let submittedPoems = JSON.parse(localStorage.getItem('submittedPoems')) || [];
   submittedPoems.unshift(poem);
     if (submittedPoems.length > 50) {
        submittedPoems = submittedPoems.slice(0, 50);
    }
     localStorage.setItem('submittedPoems', JSON.stringify(submittedPoems));
}

function updateSubmittedPoem(updatedPoem) {
    let submittedPoems = JSON.parse(localStorage.getItem('submittedPoems')) || [];
     const index = submittedPoems.findIndex(p => p.id === updatedPoem.id);
    if (index !== -1) {
        submittedPoems[index] = updatedPoem;
        localStorage.setItem('submittedPoems', JSON.stringify(submittedPoems));
    }
}

function getInitials(name) {
    return name.split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function getRandomColor() {
    const colors = [
        '#834000', 
        '#45535A', 
        '#748485', 
        '#21191A', 
        '#8B4513', 
        '#2F4F4F', 
        '#8B0000', 
        '#228B22' 
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
}

function showNotification(message) {
   
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
   
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
   
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--brown-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        font-family: "Menbere", sans-serif;
        font-size: 16px;
    `;
   
    document.body.appendChild(notification);
  
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .user-submitted {
        background-color: var(--brown-color);
        color: white;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.8rem;
        margin-left: 5px;
        font-family: "Menbere", sans-serif;
    }
    
    .no-poems-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        margin-top: 20px;
    }
    
    .no-poems-message h3 {
        font-size: 1.8rem;
        color: var(--brown-color);
        margin-bottom: 10px;
    }
    
    .no-poems-message p {
        color: var(--gray-color);
        max-width: 500px;
        margin: 0 auto;
    }
    
    .poem-card {
        background-color: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        transition: all 0.3s ease;
        margin-bottom: 20px;
    }
    
    .poem-card:hover {
        transform: translateY(-5px);
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .poem-card-header {
        display: flex;
        align-items: center;
        padding: 15px;
        background-color: #f5f5f5;
        border-bottom: 1px solid #ddd;
    }
    
    .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-right: 15px;
        font-family: "Agbalumo", sans-serif;
    }
    
    .user-info h4 {
        font-size: 1.1rem;
        margin-bottom: 5px;
        color: var(--brown-color);
    }
    
    .user-info p {
        font-size: 0.85rem;
        color: var(--gray-color);
    }
    
    .poem-card-body {
        padding: 20px;
    }
    
    .poem-card-body h3 {
        font-size: 1.5rem;
        color: var(--brown-color);
        margin-bottom: 15px;
        text-align: center;
    }
    
    .poem-content {
        color: var(--brown-color);
        line-height: 1.7;
        margin-bottom: 15px;
    }
    
    .poem-preview, .poem-full-content {
        font-family: "Menbere", sans-serif;
        font-size: 1.1rem;
        white-space: pre-wrap;
        line-height: 1.8;
    }
    
    .poem-preview {
        display: block;
    }
    
    .poem-full-content {
        display: none;
    }
    
    .read-more-btn {
        background: none;
        border: none;
        color: var(--brown-color);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 1rem;
        padding: 8px 15px;
        border-radius: 20px;
        transition: all 0.3s ease;
        margin-top: 10px;
        font-family: "Menbere", sans-serif;
    }
    
    .read-more-btn:hover {
        background-color: rgba(131, 64, 0, 0.1);
    }
    
    .read-more-btn i {
        font-size: 0.9rem;
        transition: transform 0.3s ease;
    }
    
    .read-more-btn.expanded i {
        transform: rotate(180deg);
    }
    
    .poem-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-top: 1px solid #ddd;
        background-color: #f5f5f5;
    }
    
    .poem-actions {
        display: flex;
        gap: 15px;
    }
    
    .like-btn, .save-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        font-weight: 600;
        color: var(--gray-color);
        transition: all 0.3s ease;
        padding: 5px 10px;
        border-radius: 5px;
        font-family: "Menbere", sans-serif;
    }
    
    .like-btn.active, .like-btn:hover {
        color: #e74c3c;
    }
    
    .save-btn.active, .save-btn:hover {
        color: var(--brown-color);
    }
    
    .like-btn i, .save-btn i {
        font-size: 1.1rem;
    }
    
    .poem-category {
        font-size: 0.85rem;
        color: var(--gray-color);
        background-color: white;
        padding: 5px 15px;
        border-radius: 20px;
        border: 1px solid var(--brown-color);
        font-family: "Menbere", sans-serif;
    }
    
    @media (max-width: 768px) {
        .mesob-poem {
            grid-template-columns: 1fr;
        }
        
        .poem-card {
            margin: 10px;
        }
    }
`;
document.head.appendChild(style);