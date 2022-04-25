const fetch = require('node-fetch')
const AnchorLink = require('anchor-link')
const AnchorLinkConsoleTransport = require('anchor-link-console-transport')

global.fetch = fetch

const transport = new AnchorLinkConsoleTransport.ConsoleTransport()
const link = new AnchorLink({
    transport,
    chains: [
        {
            chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
            nodeUrl: 'https://eos.greymass.com',
        }
    ],
})


async function main() {
    // Perform the login, which returns the users identity
    const identity = await link.login('mydapp')

// Save the session within your application for future use
    const {session} = identity
    console.log(`Logged in as ${session.auth}`)
}

main().catch(console.error)


