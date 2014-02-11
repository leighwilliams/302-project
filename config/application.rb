require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "rails/all"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

module ProjectPrototype
  class Application < Rails::Application
  end
end
