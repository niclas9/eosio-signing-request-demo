const ecc = require('eosjs-ecc')
const { JsonRpc, Api } = require('eosjs')

const fetch = require('node-fetch')
const util = require('util')
const zlib = require('zlib')

const url = 'https://jungle3.cryptolions.io'
const chainid = '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840'

const textEncoder = new util.TextEncoder()
const textDecoder = new util.TextDecoder()

const rpc = new JsonRpc(url, {
    fetch // only needed if running in nodejs, not required in browsers
})

const eos = new Api({
    rpc,
    textDecoder,
    textEncoder,
})

const { SigningRequest, ChainId } = require("eosio-signing-request")

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
    // const uri = 'esr://g2NgZGZgYHA4quUbzsBknVFSUlBspa-fnKSXmJeckV-kl5OZl62flJhmlJaamKqbZGaapGtikmipa5GaaqJrYpSaZGxobG5mkJLKxAJSepYRbhqz4Uemm08K7KzPL3237lNM6yyPsMj1114JhUYeTBLdkBj3dyGjI9gOH5AVxnomegYKTkX55cWpRSFFiXnFBflFJUBhY6Cwb35VZk5Oor4pkK3hm5icmVeSX5xhreCZV5KaowAUUPAPVohQMDSINzSNN9dUcCwoyEkNT03yzizRNzU21zM2U9Dw9gjx9dFRyMnMTlVwT03OztdUcM4oys9N1Tc0MNAz0DOxsDTTMzdVCE5MSyzKhGpjLU7OL0hlT61IzAWaCAA'
    // const uri = 'esr://g2NgZGYAgitZk6YzMFlnlJQUFFvp6ycn6SXmJWfkF-nlZOZl66eYGxkZmJtY6KYamqXomhgbp-pamCcb6RqkpSWapZmZGCWlGjGxgJRaIwyb9rF9_i-Nb7vXeH9b0GUQejiqL8dEOKa2ve3hNrsOocmHBBzBNviALDDWM9EzYC1Ozi9IZcutTEksKAAA'

    // identity v2
    const uri = 'esr://gmNgZmYUcOLwmjVz4ykGIFjx1siIQTSjpKSg2EpfP9kvMScnKTE5Wy85P5cBAA'

    // Decode the URI
    const decoded = SigningRequest.from(uri, opts)

    // In order to resolve the transaction, we need a recent block to form it into a signable transaction
    const head = (await rpc.get_info(true)).head_block_num;
    const block = await rpc.get_block(head);

    // Fetch the ABIs needed for decoding
    const abis = await decoded.fetchAbis();

    // An authorization to resolve the transaction to
    const authorization = {
        actor: 'eosisverygo1',
        permission: 'active',
    }

    // Resolve the transaction as a specific user
    const resolved = await decoded.resolve(abis, authorization, block);

    console.log(util.inspect(resolved, false, null, true))
    const chainId = ChainId.from(chainid)
    const digest = resolved.transaction.signingDigest(chainId).toString()
    console.log(digest)
    const privateKey = '5Kfs388vr6TM8oMsCd4xfkqsR9132nw9TWfpma7NNfRzvMN3vxA'
    console.log(ecc.isValidPrivate(privateKey))
    console.log(ecc.sign(digest, privateKey).toString())
}

main().catch(console.error)
