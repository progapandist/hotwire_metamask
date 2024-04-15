class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:metamask_auth]
  before_action :set_user, only: [:create]

  LOGIN_SUCCESS = "Logged in successfully."
  LOGOUT_SUCCESS = "Logged out successfully."
  LOGIN_FAILED = "Log in failed."
  LOGOUT_FAILURE = "Log out failed."

  def new
  end

  def create
    if user
      auto_login(user)
      render_json(true, LOGIN_SUCCESS, :created)
    else
      render_json(false, LOGOUT_FAILURE, :unprocessable_entity)
    end
  rescue => e
    render_json(false, e, :internal_server_error)
  end

  def destroy
    if logout
      render_json(true, LOGOUT_SUCCESS, :no_content)
    else
      render_json(false, LOGOUT_FAIL, :unprocessable_entity)
    end
  rescue => e
    render_exception(e)
  end

  private

  attr_reader :user

  def set_user
    @user = User.find_or_create_by(ethereum_address_params)
  end

  def ethereum_address_params
    params.require(:session).permit(:ethereum_address)
  end

  def render_json(success, notice, status = :ok)
    render json: {success:, notice:}, status:
  end
end
