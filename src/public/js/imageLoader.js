document.body.querySelectorAll('.img').forEach($img => {
    console.log($img.dataset.img);
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
})