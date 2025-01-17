class AlphabetGallery extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.imagesPerLetter = 3;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.displayImages('ALL');
        this.shadowRoot.querySelector('button[data-letter="ALL"]').classList.add('active');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .controls {
                    display: flex;
                    flex-wrap: wrap;
                    margin-bottom: 20px;
                    border-left: 1px solid white;
                    border-right: 1px solid white;
                    width:fit-content;
                    padding:0 0.25rem;
                    font-family: 'IBM Plex Mono';
                }
                button {
                    padding: 0.25rem;
                    border: none;
                    background: transparent;
                    color: white;
                    cursor: pointer;
                }
                button:hover, button.active {
                    background: linear-gradient(to bottom, var(--color1), transparent, var(--color1));
                }
                .gallery {
                    display:flex;
                    justify-content:center;
                    flex-wrap: wrap;
                }
                .image-container {
                    flex: 1;
                    display:flex;
                    align-items:center;
                    position:relative;
                    background: radial-gradient(circle closest-side at center, rgba(0 0 0 / 50%), transparent);
                }
                .all-gallery {
                    flex-basis: 10%;
                    cursor:pointer;
                    flex-grow:0;
                }
                .all-gallery:hover {
                    scale:1.1;
                }
                img {
                    width: 100%;
                    object-fit: contain;
                    color:transparent;
                    cursor: pointer;
                    border-radius:0.5rem;
                    position:relative;
                    z-index:2;
                }
                .loading::after {
                    content:'';
                    display;block;
                    position:absolute;
                    top:50%;
                    left:50%;
                    translate:-50% -50%;
                    width: 30px;
                    height: 30px;
                    border: 2px solid white;
                    border-bottom-color: transparent;
                    border-radius: 50%;
                    animation: rotation 1s linear infinite;
                }

                @keyframes rotation {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                } 
                
                img.loaded {
                    display: block;
                }
                .letter {
                    padding: 1rem;
                    flex: 1;
                    display: grid;
                    place-content: center;
                    font-size: 6rem;
                    margin-top: 0;
                }
                @media screen and (max-width: 800px) {
                    .image-container.all-gallery {
                        flex-basis: 30%;
                    }
                    .image-container {
                        flex-grow:0;
                        flex-basis: 50%;
                    }
                    .letter {
                        padding: 0;
                        line-height: 1;
                        font-size: 39vw;
                    }
                }
            </style>
            <div class="controls">
                <button data-letter="ALL">ALL</button>
                ${this.letters.map(letter => 
                    `<button data-letter="${letter}">${letter}</button>`
                ).join('')}
            </div>
            <div class="gallery"></div>
        `;
    }

    setupEventListeners() {
        const buttons = this.shadowRoot.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const letter = button.dataset.letter;
                this.displayImages(letter);
            });
        });
    }

    getRandomImageNumber() {
        return Math.floor(Math.random() * this.imagesPerLetter) + 1;
    }

    createImageElement(src, alt, letter = null) {
        const container = document.createElement('div');
        container.className = 'image-container';
        container.classList.add('loading');

        const img = document.createElement('img');
        img.addEventListener('load', () => {
            container.classList.remove('loading');
        });
        
        img.addEventListener('error', () => {
            container.textContent = 'Image not found';
        });

        // Add click handler if letter is provided (ALL view)
        if (letter) {
            img.addEventListener('click', () => {
                this.displayImages(letter);
                // Update button visual state if needed
                const button = this.shadowRoot.querySelector(`button[data-letter="${letter}"]`);
                if (button) {
                    button.click();
                }
            });
        }

        img.src = src;
        img.alt = alt;
        container.appendChild(img);
        return container;
    }

    displayImages(letterFilter) {
        const gallery = this.shadowRoot.querySelector('.gallery');
        gallery.innerHTML = '';

        if (letterFilter === 'ALL') {
            this.letters.forEach(letter => {
                const imageNumber = this.getRandomImageNumber();
                const container = this.createImageElement(
                    `/assets/images/small/${letter}${imageNumber}.webp`,
                    `${letter}${imageNumber}`,
                    letter  // Pass the letter for click handling
                );
                container.classList.add('all-gallery');
                gallery.appendChild(container);
            });
        } else {
            for (let i = 1; i <= this.imagesPerLetter; i++) {
                const container = this.createImageElement(
                    `/assets/images/big/${letterFilter}${i}.webp`,
                    `${letterFilter}${i}`
                );
                gallery.appendChild(container);
            }
            const letterDisplay = document.createElement('div');
            letterDisplay.classList.add('letter')
            letterDisplay.textContent = letterFilter;
            gallery.appendChild(letterDisplay);
        }
    }
}

customElements.define('alphabet-gallery', AlphabetGallery);