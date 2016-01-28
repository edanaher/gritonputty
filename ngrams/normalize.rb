#!/usr/bin/env ruby

require 'json'
class Float
  def signif(signs)
    Float("%.#{signs}g" % self)
  end
end

lines = STDIN.readlines

header = lines[0].split(",")
wordBeginColumn = header.find_index { |h| h.start_with?("*/1:") }

table = lines[1..-1].map { |l| l.chomp.split(",") }
table = table.map { |s| [s[0], [s[1], s[wordBeginColumn]].map(&:to_i)] }

totals = table.inject([0] * table[0][1].length) do |totals, row|
  row[1].zip(totals).map { |a,b| a + b }
end

table = table.map { |letter, row| [letter, row.zip(totals).map { |c, t| c.to_f / t }] }

freqs, firsts = [0, 1].map do |c|
  Hash[table.map { |letter, row| [letter.downcase, row[c].signif(4)] }.select { |l, f| f > 0 }]
end

output = JSON.dump({ ARGV[0] => { freqs: freqs, firsts: firsts } })

puts output[1..-2]
