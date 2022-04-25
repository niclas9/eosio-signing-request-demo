const { JsonRpc, Api } = require('eosjs')

const fetch = require('node-fetch')
const util = require('util')
const zlib = require('zlib')

const textEncoder = new util.TextEncoder()
const textDecoder = new util.TextDecoder()

const rpc = new JsonRpc('https://eos.greymass.com', {
    fetch // only needed if running in nodejs, not required in browsers
})

const eos = new Api({
    rpc,
    textDecoder,
    textEncoder,
})

const { SigningRequest } = require("eosio-signing-request")

// options for the signing request
const opts = {
    // string encoder
    textEncoder,
    // string decoder
    textDecoder,
    // zlib string compression (optional, recommended)
    zlib: {
        deflateRaw: (data) => new Uint8Array(zlib.deflateRawSync(Buffer.from(data))),
        inflateRaw: (data) => new Uint8Array(zlib.inflateRawSync(Buffer.from(data))),
    },
    // Customizable ABI Provider used to retrieve contract data
    abiProvider: {
        getAbi: async (account) => (await eos.getAbi(account))
    }
}

async function main() {
    // An encoded eosio:voteproducer transaction
    // const uri = 'esr://gmNgZGRkAIFXBqEFopc6760yugsVYWBggtKCMIEFRnclpF9eTWUACgAA'
    // const uri = 'esr:gmPUYlrAahfV890qbBf_LcEnN_WYLJYsWlXy57zb1ZUCJRkOTAwogBFMvjIIZWCw15JetsiLUUDjc3juG5AAA8OKt0ZGhjABZAkQYHH1DwbRAuqofAYGJuuMkpKCYit9_eQkvcS85Iz8Ir2czLxsfXMzE0tzEyMjXVND4zRdE3OzJF0LUwMLXZM0Q-NkE0vTJIO0VEbuotSS0qK8-ILEkgx9mEFZpXnpOanGekk5-dnFepn5-uWJOTmpJfpFqcX5pUXJqcX6xSWJ2akA'
    const uri = 'esr://g2NgZGZgYHA4quUbzsBknVFSUlBspa-fnKSXmJeckV-kl5OZl62flJhmlJaamKqbZGaapGtikmipa5GaaqJrYpSaZGxobG5mkJLKxAJSepYRbhqz4Uemm08K7KzPL3237lNM6yyPsMj1114JhUYeTBLdkBj3dyGjI9gOH5AVxnomegYKTkX55cWpRSFFiXnFBflFJUBhY6Cwb35VZk5Oor4pkK3hm5icmVeSX5xhreCZV5KaowAUUPAPVohQMDSINzSNN9dUcCwoyEkNT03yzizRNzU21zM2U9Dw9gjx9dFRyMnMTlVwT03OztdUcM4oys9N1Tc0MNAz0DOxsDTTMzdVCE5MSyzKhGpjLU7OL0hlT61IzAWaCAA'


    // Decode the URI into the original signing request
    const decoded = SigningRequest.from(uri, opts)
    console.log(util.inspect(decoded, false, null, true))
    // console.log(decoded.toString())
}

main().catch(console.error)
