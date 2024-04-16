Rails.application.routes.draw do
  root "sessions#new"
  resources :sessions, only: [:new, :index]
  post "/auth/metamask", to: "sessions#create"
  delete "/auth/logout", to: "sessions#destroy"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", :as => :rails_health_check
end
