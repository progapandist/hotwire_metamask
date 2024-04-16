# Presail Rails 7.1.3 (Hotwire) ft. Metamask login Demo

> Time taken for `rails new` + Metamask integration: 4 hours
> Time taken for Kamal deployment took ~5 hours (as I had to research Kamal a bit that I was actively aware of but never set it up myself. The Letsencrypt part is missing from the docs so I had to dig a bit to make it work via HTTPS)
> Costs: $46/month DO droplet (I will kill it the moment you give me feeback)

## Stack

- Rail 7 with minimal setup:

```bash
rails new my_web3_app --database=sqlite3 --skip-sprockets --skip-javascript --skip-turbolinks --skip-action-mailbox --skip-action-text --skip-active-storage --skip-system-test --skip-webpacker --skip-coffee --skip-spring --skip-listen --skip-bootsnap --skip-action-cable --skip-callbacks
```

- DB: SQlite 3 that is now baked into the ephemeral container server-side, so each new redeploy loses users, but if I had another hour or two I would replicate SQLite with Fly.io and avoid this problem.

- FE: Hotwire/Stimulus

- JS Bundling: `importmaps` just for the sake of simplicity and to avoid bundling altogether. The only reason `package.json` is there is for local linting with Prettier.

- Tooling: `.vscode/settings.json` contains the setup for working locally (linting and formatting Ruby, HTML, ERB, and JS files on save). Ruby LSP provides the language server for Ruby.

- Styling: Tailwind 💅

## UI Flow



https://github.com/progapandist/hotwire_metamask/assets/12513436/5d64df2e-4f53-484e-9186-5d9152b5ad51



## Kamal Deploy Flow (for the curious)

Note that each deploy currently clears the DB for the sake of demo, but it can be easily mitigated by using a persistent DB like Postgres or MySQL. Or by replicating SQLite with Fly.io. Or by storing SQLite on a volume on a VPS.



https://github.com/progapandist/hotwire_metamask/assets/12513436/84020807-8829-404d-bb3e-118239b9c148



## Testing considerations

I did not have time to write tests for this project, but I would have used RSpec or Minitest (I prefer the latter, but am very comfortable with the former as well) for unit tests and Capybara for integration tests. For the Stimulus controller, we can test the Metamask handshake in isolation by mocking the payload.

The mock would look something like this:

```js
import { Application } from "@hotwired/stimulus";
import MetaMaskController from "controllers/metamask_controller";

// Mock MetaMask's ethereum object
global.window.ethereum = {
  request: jest.fn().mockImplementation(({ method }) => {
    if (method === "eth_requestAccounts") {
      return Promise.resolve(["0x123"]); // Mock Ethereum account address
    }
  }),
};

test("signIn with MetaMask", async () => {
  const application = Application.start();
  application.register("metamask", MetaMaskController);

  document.body.innerHTML = `
    <div data-controller="metamask">
      <input data-metamask-target="address" type="hidden"/>
      <button data-action="click->metamask#signIn"></button>
    </div>
  `;

  const button = document.querySelector("button");
  await button.click(); // Simulate button click

  // Assertions
  expect(window.ethereum.request).toHaveBeenCalledWith({
    method: "eth_requestAccounts",
  });
  expect(document.querySelector('[data-metamask-target="address"]').value).toBe(
    "0x123"
  );
});
```

And the full integration test that skips the real network can look like:

```rb
module MetaMaskMocks
  def mock_metamask_success
    # Mock successful sign-in (e.g., using Mocha, RSpec mocks, or MiniTest)
    # This will depend on your backend MetaMask authentication implementation
    # Example for Mocha:
    User.any_instance.stubs(:authenticate_via_metamask).returns(true)
  end
end
```

```rb
require "application_system_test_case"
require "support/meta_mask_mocks"

class UsersSignInWithMetaMaskTest < ApplicationSystemTestCase
  include MetaMaskMocks

  test "user signs in with MetaMask successfully" do
    mock_metamask_success

    visit new_session_path
    click_on "Sign in with MetaMask"

    # Assuming your app redirects to a dashboard or shows a success message on successful login
    assert_text "Logged in successfully."
  end
end
```

## Proposed Improvements 

I would love to see WebAuthn and biometric Passkeys (now availale in Apple devices to work hand in hand as a possible second factor for the anonymous Metamask login. 
