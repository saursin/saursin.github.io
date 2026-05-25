require 'nokogiri'
require 'open-uri'

module Jekyll
  class GoogleScholarProfileGenerator < Generator
    safe true
    priority :low

    def generate(site)
      scholar_id = site.data.dig('socials', 'scholar_userid')
      return unless scholar_id

      url = "https://scholar.google.com/citations?user=#{scholar_id}&hl=en"

      begin
        sleep(rand(1.0..2.0))
        doc = Nokogiri::HTML(URI.open(url, "User-Agent" => "Ruby/#{RUBY_VERSION}"))

        since_year = doc.css('#gsc_rsb_st thead th').last&.text&.match(/(\d{4})/)&.[](1)

        stats = { 'since_year' => since_year }
        doc.css('#gsc_rsb_st tbody tr').each do |row|
          label = row.css('.gsc_rsb_sc1 a').text.strip.downcase
          values = row.css('.gsc_rsb_std').map(&:text)
          case label
          when 'citations'
            stats['citations']       = values[0]
            stats['citations_since'] = values[1]
          when 'h-index'
            stats['h_index']       = values[0]
            stats['h_index_since'] = values[1]
          when 'i10-index'
            stats['i10_index']       = values[0]
            stats['i10_index_since'] = values[1]
          end
        end

        site.data['scholar_profile'] = stats
        Jekyll.logger.info "Scholar:", "citations=#{stats['citations']}, h=#{stats['h_index']}, i10=#{stats['i10_index']}"
      rescue => e
        Jekyll.logger.warn "Scholar:", "Could not fetch profile metrics: #{e.message}"
      end
    end
  end
end
