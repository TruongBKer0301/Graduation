(() => {
    const initGalleryLightbox = () => {
        const gallerySection = [...document.querySelectorAll('section')].find((section) =>
            section.querySelector('h2')?.textContent.trim() === 'Hành Trình Thanh Xuân'
        );

        if (!gallerySection) return;

        const images = [...gallerySection.querySelectorAll('.grid img')];
        if (!images.length) return;

        const lightbox = document.createElement('div');
        lightbox.id = 'gallery-lightbox';
        lightbox.className = 'gallery-lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Xem ảnh album');
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.innerHTML = `
            <button type="button" class="gallery-lightbox__close" aria-label="Đóng ảnh">&times;</button>
            <figure class="gallery-lightbox__figure">
                <img class="gallery-lightbox__image" alt="">
                <figcaption class="gallery-lightbox__caption"></figcaption>
            </figure>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .gallery-lightbox {
                position: fixed;
                inset: 0;
                z-index: 100;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 3rem 1rem 1rem;
                background: rgba(2, 6, 23, .94);
                backdrop-filter: blur(8px);
            }
            .gallery-lightbox.is-open { display: flex; }
            .gallery-lightbox__figure {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: .75rem;
                max-width: min(96vw, 1200px);
                max-height: 100%;
                margin: 0;
            }
            .gallery-lightbox__image {
                display: block;
                max-width: 100%;
                max-height: calc(100vh - 7rem);
                object-fit: contain;
                border-radius: .75rem;
                box-shadow: 0 20px 60px rgba(0, 0, 0, .5);
            }
            .gallery-lightbox__caption { color: #e2e8f0; text-align: center; }
            .gallery-lightbox__close {
                position: absolute;
                top: .75rem;
                right: 1rem;
                width: 2.75rem;
                height: 2.75rem;
                border: 1px solid rgba(197, 168, 128, .6);
                border-radius: 9999px;
                background: #0f172a;
                color: #fff;
                font-size: 2rem;
                line-height: 1;
                cursor: pointer;
            }
            .gallery-lightbox__close:hover { background: #1e293b; }
            .gallery-lightbox-trigger { cursor: zoom-in; }
            .gallery-lightbox-trigger:focus-visible {
                outline: 3px solid #fbbf24;
                outline-offset: 3px;
            }
        `;

        document.head.append(style);
        document.body.append(lightbox);

        const enlargedImage = lightbox.querySelector('.gallery-lightbox__image');
        const caption = lightbox.querySelector('.gallery-lightbox__caption');
        const closeButton = lightbox.querySelector('.gallery-lightbox__close');
        let previouslyFocused = null;

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            enlargedImage.removeAttribute('src');
            if (previouslyFocused) previouslyFocused.focus();
        };

        const openLightbox = (thumbnail) => {
            previouslyFocused = thumbnail;
            enlargedImage.src = thumbnail.currentSrc || thumbnail.src;
            enlargedImage.alt = thumbnail.alt;
            caption.textContent = thumbnail.alt;
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            closeButton.focus();
        };

        images.forEach((image) => {
            image.classList.add('gallery-lightbox-trigger');
            image.tabIndex = 0;
            image.setAttribute('role', 'button');
            image.setAttribute('aria-label', `Phóng to: ${image.alt || 'ảnh trong album'}`);
            image.addEventListener('click', () => openLightbox(image));
            image.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(image);
                }
            });
        });

        closeButton.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (event) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (event.key === 'Escape') closeLightbox();
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGalleryLightbox, { once: true });
    } else {
        initGalleryLightbox();
    }
})();
