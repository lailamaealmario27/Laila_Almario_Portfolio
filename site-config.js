// Web3Forms access key. This is the whole configuration of the contact form.
//
// WHERE TO GET IT
// Sign in at https://app.web3forms.com and copy the form's ACCESS KEY. It is a UUID,
// shaped like 1a2b3c4d-5e6f-7890-abcd-ef1234567890. Web3Forms also emails it when you
// first create it, but the dashboard is the reliable place to read it from.
//
// DO NOT paste an API KEY here. Those live under Account -> API Keys, start with
// w3f_live_, and are Bearer tokens for Web3Forms' server-side submissions API. They
// are secrets. This file is served to every visitor, so an API key put here would be
// published to the world. The access key is the opposite: it is public by design and
// only ever permits sending to the single address it was issued for, which is why
// Web3Forms recommends using it from the browser.
//
// Until this is filled in, the form tells visitors to email directly instead.
export const WEB3FORMS_ACCESS_KEY = 'PASTE-YOUR-WEB3FORMS-ACCESS-KEY-HERE';
