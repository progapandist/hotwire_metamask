import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["address"];

  connect() {
    this.checkMetaMaskAvailability();
  }

  checkMetaMaskAvailability() {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    } else {
      console.error(
        "MetaMask is not installed. Please install MetaMask to use this feature.",
      );
    }
  }

  async signIn() {
    if (typeof window.ethereum === "undefined") {
      console.error("MetaMask is not installed!");
      alert("Please install MetaMask to continue.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      this.addressTarget.value = account;
      await this.submitAddressToBackend(account);
    } catch (error) {
      console.error("Error signing in with MetaMask:", error);
    }
  }

  async signOut() {
    try {
      const response = await fetch("/auth/logout", {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Logged out successfully");
        window.location.reload();
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      this.showToast(
        `Error: ${error}`,
        "An error occurred while processing your request.",
      );
    }
  }

  async submitAddressToBackend(account) {
    try {
      const response = await fetch("/auth/metamask", {
        method: "POST",
        headers: {
          "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ethereum_address: account,
        }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.reload();
      } else {
        throw new Error("Server responded with an error");
      }
    } catch (error) {
      // Assuming showToast is a method to show UI notifications - you would need to define this.
      this.showToast(
        `Error: ${error}`,
        "An error occurred while processing your request.",
      );
    }
  }

  showToast(title, message) {
    // Just the console log for now but can use Turbo Streams here!
    console.log(`${title}: ${message}`);
  }
}
