export function loadImages($container=document.body) {
    $container.querySelectorAll('.img').forEach($img => {
        if($img.dataset.img === undefined) {
            return;
        }

        const img = new Image();
        img.src = $img.dataset.img;

        img.onload = () => {
            const $inner = document.createElement('div');
            $inner.classList.add('image-loaded');
            $inner.style.backgroundImage = `url('${img.src}')`;

            if(window.getComputedStyle($img).position !== 'absolute') {
                $img.style.position = 'relative';
            }

            $img.appendChild($inner);
        };
    });
}