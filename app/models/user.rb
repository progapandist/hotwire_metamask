class User < ApplicationRecord
  authenticates_with_sorcery!
  validates :ethereum_address, presence: true, uniqueness: true
end
