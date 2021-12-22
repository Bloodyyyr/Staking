import React, { Component } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import CardHeader from "react-bootstrap/CardHeader"
import ERC20Token from "./contracts/ERC20Token.json";
import StakingEth from "./contracts/StakingEth.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
    state = { 
      web3: null,
      accounts: null,
      contractToken: null,
      contractStaking: null,
      balanceEth: null,
      balanceOfReward: null,
      ownerStaking: null,
      addressContractStaking: null,
      ethStack: 0,
      balanceReward: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ERC20Token.networks[networkId];
      const instance = new web3.eth.Contract(
        ERC20Token.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const deployedNetwork01 = StakingEth.networks[networkId];
      const instance01 = new web3.eth.Contract(
        StakingEth.abi,
        deployedNetwork01 && deployedNetwork01.address,
      );

      const owner = await instance01.methods.owner().call();
      const addressStaking = "0x421bD2bC5e1322321BEee5f9Fdbc3E75b632f4E2";  


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contractToken: instance, contractStaking: instance01, ownerStaking: owner, addressContractStaking: addressStaking });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  transferOwner = async () => {
    const { contractToken, accounts, addressContractStaking } = this.state;

    let amount = document.getElementById("amount").value;

    await contractToken.methods.transfer(addressContractStaking, amount).send({from: accounts[0]});
  }

  balanceOf = async  () =>{
    const { contractToken, accounts } = this.state;
    
    const balance = await contractToken.methods.balanceOf(accounts[0]).call();

    this.setState({balanceOfReward: balance});    
  }

  transerEth = async () => {
    const { accounts, addressContractStaking, web3 } = this.state;

    let amount = document.getElementById("amountEth").value;

    web3.eth.sendTransaction({to:addressContractStaking, from:accounts[0], value:amount})
  }

  viewBalanceStack = async () => {
    const { contractStaking, accounts } = this.state;

    let balanceStack = await contractStaking.methods.getBalanceStack(accounts[0]).call();

    this.setState({ethstack: 0, ethStack: balanceStack});
    
  } 
  
  viewBalanceReward = async () => {
    const { contractStaking } = this.state;

    const balance = await contractStaking.methods.viewReward().call();

    this.setState({balanceReward: balance})
  }

  calculReward = async () => {
    const { contractStaking, accounts } = this.state;

    await contractStaking.methods.calculedReward().send({from: accounts[0]});

  }

  claimMyReward = async () => {
    const { contractStaking, accounts } = this.state;

    await contractStaking.methods.claimReward().send({from: accounts[0]});

  }

  whithdrawEth = async () => {
    const { contractStaking, accounts } = this.state;

    await contractStaking.methods.whithdraw(accounts[0]).send({from: accounts[0]});

  }
  


  render() {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
     });
     
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    
    else if (this.state.ownerStaking == this.state.accounts){
      return (
        <div className="App">
  
          <CardHeader>
            <h1>Bienvenue pret pour le Staking ? </h1>
            <p>accounts:{this.state.accounts}</p>
          </CardHeader>
          <Container className="Session Users">
            <p>Vous detenez actuellement: {this.state.balanceOfReward}</p>
            <Button className="Solde Reward" onClick={ this.balanceOf }>voir votre solde</Button>
          </Container>
          <br></br>
          <Container className="Session Owner">
            <p>Envoyé les token au smart contract</p>
            <input className="Montant a transfert de mon token" id="amount"></input>
            <Button className="Validation du montant a tranfert" onClick={ this.transferOwner }>Valider</Button>
          </Container>
          <br></br>
          <Container>
            <p>Entrez le montant d'ether a Stack en wei</p><br></br>
            <input className="Montant d'eth a envoyé" id="amountEth"></input>
            <Button className="Valide la l'envoie d'Eth" onClick={ this.transerEth }>Valider</Button>
          </Container>
          <br></br>
          <Container>
            <p>Recupere vos ether Stack</p>
            <Button className="Whithdraw Eth" onClick={ this.whithdrawEth }>Whithdraw</Button>

          </Container>
          <br></br>
          <Container>
            <p>Votre solde stack est de :{ this.state.ethStack }</p>
            <Button className="voir mon solde Eth stack" onClick={ this.viewBalanceStack } > Voir mon solde Stack</Button>
          </Container>
          <br></br>
          <Container>
            <p>Votre recompense s'eleve a :{ this.state.balanceReward }</p>
            <Button className="Voir son solde Reward" onClick={ this.viewBalanceReward }>View</Button> 
            <Button className="Calcule de recompense" onClick={ this.calculReward }> Calcul </Button>
            <br></br>
            <Button className="Reclamer la recompense" onClick={ this.claimMyReward }>Claim</Button>
          </Container>

        </div>
      );
    }

    return (
      <div className="App">

        <CardHeader>
          <h1>Bienvenue pret pour le Staking ? </h1>
          <p>accounts:{this.state.accounts}</p>
        </CardHeader>
        <Container>
          <p>Vous detenez actuellement: {this.state.balanceOfReward}</p>
          <Button className="Solde Reward" onClick={ this.balanceOf }>voir votre solde</Button>
        </Container>
        <br></br>
        <Container>
        <p>Entrez le montant d'ether a Stack en wei</p><br></br>
        <input className="Montant d'eth a envoyé" id="amountEth"></input>
        <Button className="Valide la l'envoie d'Eth" onClick={ this.transerEth }>Valider</Button>
        </Container>
        <br></br>
        <Container>
            <p>Recupere vos ether Stack</p>
            <Button className="Whithdraw Eth" onClick={ this.whithdrawEth }>Whithdraw</Button>

          </Container>
        <br></br>
        <Container>
            <p>Votre solde stack est de :{ this.state.ethStack }</p>
            <Button className="voir mon solde Eth stack" onClick={ this.viewBalanceStack } > Voir mon solde Stack</Button>
          </Container>
          <br></br>

          <Container>
            <p>Votre recompense s'eleve a :{ this.state.balanceReward }</p>
            <Button className="Voir son solde Reward" onClick={ this.viewBalanceReward }>View</Button> 
            <Button className="Calcule de recompense" onClick={ this.calculReward }> Calcul </Button>
            <br></br>
            <Button className="Reclamer la recompense" onClick={ this.claimMyReward }>Claim</Button>
          </Container>
          
      </div>
    );
  }
}

export default App;
