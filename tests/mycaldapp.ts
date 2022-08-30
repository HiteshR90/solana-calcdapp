const assert = require('assert');
const anchor = require('@project-serum/anchor');
const {SystemProgram} = anchor.web3;

describe('mycalcdapp', ()=>{

    const provider = anchor.AnchorProvider.local();
    anchor.setProvider(provider);
    const calculator = anchor.web3.Keypair.generate();
    const program = anchor.workspace.Mycaldapp;

    it('create a calculator', async ()=> {
        await program.rpc.create("Welcome to solana", {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId
            },
            signers: [calculator]
        });

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.greeting == 'Welcome to solana');
    })

    it('add 2 numbers', async ()=>{
        await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        });

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(5)));
    })

    it('subtract 2 numbers', async ()=>{
        await program.rpc.sub(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        });

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(-1)));
    })

    it('Muliply 2 numbers', async ()=>{
        await program.rpc.mul(new anchor.BN(2), new anchor.BN(2), {
            accounts: {
                calculator: calculator.publicKey
            }
        });

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(4)));
    })

    it('Divide 2 numbers', async ()=>{
        await program.rpc.divide(new anchor.BN(10), new anchor.BN(2), {
            accounts: {
                calculator: calculator.publicKey
            }
        });

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(5)));
        assert.ok(account.reminder.eq(new anchor.BN(0)));
    })
})