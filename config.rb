# Debug
activate :pry

# i18n
activate :i18n, :mount_at_root => :us

# Settings
set :variable, 'Will be accessible as config.variable'

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/
# require "helpers/custom_helpers"
# helpers CustomHelpers


# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings
configure :development do
  set :js_dir, '/public/js'
  set :css_dir, '/public/css'
  set :images_dir, '/public/images'
  set :videos_dir, '/public/videos'
  set :svg_dir, '/public/svg'
end

# Build-specific configuration
configure :build do
  ignore 'assets*'

  # Use relative URLs
  activate :relative_assets
  set :relative_links, true

  set :images_dir, '../public/images'
  set :videos_dir, '../public/videos'
  set :svg_dir, '../public/svg'
  set :css_dir, '../public/css'
  set :js_dir, '../public/js'
end
