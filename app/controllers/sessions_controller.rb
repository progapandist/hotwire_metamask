class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:metamask_auth]

  def new
  end

  def destroy
    if logout
      render json: {success: true, notice: "Logged out successfully."}, status: :no_content
    else
      render json: {success: false, error: "Log out failed."}, status: :unprocessable_entity
    end
  rescue => e
    render json: {success: false, error: e.message}, status: :internal_server_error
  end

  def metamask_auth
    @user = User.find_or_create_by(ethereum_address: params[:ethereum_address])
    if @user.persisted?
      auto_login(@user)
      render json: {success: true, notice: "Logged in successfully."}, status: :ok
    else
      render json: {success: false, error: "Authentication failed."}, status: :unprocessable_entity
    end
  rescue => e
    render json: {success: false, error: e.message}, status: :internal_server_error
  end
end
