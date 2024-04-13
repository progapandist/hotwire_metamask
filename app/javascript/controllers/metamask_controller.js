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
        "MetaMask is not installed. Please install MetaMask to use this feature."
      );
      // Optionally, inform the user via UI that MetaMask is required
    }
  }

  signOut() {
    // Assuming sign-out does not need to interact with MetaMask
    // but rather, you're clearing session data on your server
    fetch("/auth/logout", {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Logged out successfully");
          // Redirect the user or refresh the page
          window.location.reload();
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  async signIn() {
    // Guard clause to ensure early exit if MetaMask is not available
    if (typeof window.ethereum === "undefined") {
      console.error("MetaMask is not installed!");
      alert("Please install MetaMask to continue.");
      return; // Stop execution if MetaMask is not found
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      this.addressTarget.value = account; // Sets the value of the input field

      this.submitAddressToBackend(account);
    } catch (error) {
      console.error("Error signing in with MetaMask:", error);
      // Handle specific errors, e.g., user rejection, and inform the user appropriately
    }
  }

  // Update the submitAddressToBackend method
  submitAddressToBackend(account) {
    fetch("/auth/metamask", {
      method: "POST",
      headers: {
        "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ethereum_address: account,
      }),
    })
      .then((response) => response.json()) // Directly parsing as JSON
      .then((data) => {
        if (data.success) {
          // Redirect the user or refresh the page
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.showToast("Error", "error");
      });
  }
}
