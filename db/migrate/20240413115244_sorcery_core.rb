class SorceryCore < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email,            default: nil, null: true, index: { unique: true }
      t.string :crypted_password,  default: nil, null: true
      t.string :salt,              default: nil, null: true
      t.string :ethereum_address, null: false

      t.timestamps                null: false
    end
  end
end
