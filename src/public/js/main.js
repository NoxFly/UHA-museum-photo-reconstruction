/**
 * @copyright Copyrights (C) 2023 Dorian Thivolle - All rights reserved.
 * @author Dorian Thivolle
 */

import * as Gallery from './gallery.js';
import * as ImageLoader from './imageLoader.js';

const $home = document.getElementById('home');
const $gallery = document.getElementById('gallery');
const $loader = document.getElementById('loader');



$home?.querySelector('button')?.addEventListener('click', () => {
    transitionFromTo($home, $loader, () => {
        Gallery.load();
        ImageLoader.loadImages($gallery);

        setTimeout(() => {
            transitionFromTo($loader, $gallery, () => {
                Gallery.start();
            });
        }, 1000); // add delay to simulate loading
    });
});


function loadOnce($el, event, cb) {
    $el.addEventListener(event, cb, { once: true });
}

function transitionFromTo($from, $to, cb) {
    $from.classList.add('hiding');
    
    loadOnce($from, 'animationend', () => {
        $from.classList.add('hidden');
        $from.classList.remove('hiding');

        $to.classList.remove('hidden');
        $to.style.animation = 'sectionAppear 1s forwards ease-in-out';

        cb();
    });
}