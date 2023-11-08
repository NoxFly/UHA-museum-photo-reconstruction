/**
 * @copyright Copyrights (C) 2021 - 2023 NoxFly All rights reserved.
 * @author NoxFly
 * @since 2021
 */


const baseUri = document.baseURI.replace(/\/public\/?$/, '');



/**
 * @param {string} response
 */
const debugResponse = txt => {
    const $debug = document.createElement('div');
    $debug.classList.add('ajax-request-debug');
    $debug.innerHTML = txt;
    document.body.querySelector('main').prepend($debug);
};


/**
 * @param {string} url
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method
 * @param {*|FormData} data
 * @param {'text'|'json'} type
 * @param {'json'|'urlencoded'|'multipart'} contentType
 */
const AJAX = (url, method, data={}, type='json', contentType='json') => {
    return new Promise((resolve, reject) => {
        if(!['GET', 'POST', 'PUT', 'DELETE'].includes(method))
            reject('Unknown method');

        if(data === null)
            data = {};

        else if(typeof data !== 'object')
            reject('AJAX\'s data must be object type.');

        const startsWithSlash = url[0] === '/';

        if(startsWithSlash || !/^(http)?:?\/?\//.test(url)) {
            url = `${baseUri}${startsWithSlash?'':'/'}${url.slice(1)}`;
        }

        switch(contentType) {
            case 'json': contentType = 'application/json'; break;
            case 'urlencoded': contentType = 'application/x-www-form-urlencoded'; break;
            case 'multipart': contentType = 'multipart/form-data'; break;
        }

        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', contentType);
        headers.append('Access-Control-Origin', '*');

        /**
         * @var {RequestInit} options
         */
        const options = {
            method: method,
            headers: headers,
            mode: 'cors'
        };

        if(method !== 'GET') {
            options.body = data;

            if(!(data instanceof FormData)) {
                try {
                    options.body = JSON.stringify(data);
                }
                catch(e) {
                    console.error('Failed to parse Form Request Data as JSON :', data, e);
                    reject(e);
                }
            }
        }


        return fetch(url, options)
            .then(async response => {
                if(response.status !== 200) {
                    return reject({
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url,
                        headers: response.headers,
                        body: data,
                        response: response.text()
                    });
                }

                const txtResult = await response.text();

                if(type === 'json') {
                    try {
                        const data = JSON.parse(txtResult);

                        if('status' in data && data.status !== 200) {
                            return reject(data);
                        }

                        return data;
                    } catch(e) {
                        debugResponse(txtResult);
                        throw new Error('Failed to parse response as JSON.');
                    }
                }

                return txtResult;
            })
            .then(resolve)
            .catch(reject);
    });
};

/**
 * @param {string} url
 * @param {*|FormData} data
 * @param {'text'|'json'} type
 * @param {'json'|'urlencoded'|'multipart'} contentType
 */
export const GET = (url, type='json', contentType='json') => AJAX(url, 'GET', null, type, contentType);