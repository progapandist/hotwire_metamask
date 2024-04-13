import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["address"]

  connect() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    }
  }

  async signIn() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    this.addressTarget.value = account; // Assuming you have an input field to store the address.
    // Submit the address to your Rails backend for authentication.
  }
}
