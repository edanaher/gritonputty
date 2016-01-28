default: stats.js

# Files taken from http://norvig.com/mayzner.html

ngrams1.csv:
	wget 'https://www.google.com/fusiontables/exporttable?query=select+*+from+1DlRnW1jLqZrRqVMlII39sJgWM5qH0hki_KcehSY&o=csv' -O ngrams1.csv

ngrams2.csv:
	wget 'https://www.google.com/fusiontables/exporttable?query=select+*+from+15jK-3WUD-JjQMdwLe-ipwqkUdjvf2JKK-D-s9as&o=csv' -O ngrams2.csv

ngrams3.csv:
	wget 'https://www.google.com/fusiontables/exporttable?query=select+*+from+1Va3VOFJ-zk9qrMsoyyEeTDiFlQIw1k4PPurYhnM&o=csv' -O ngrams3.csv

ngrams4.csv:
	wget 'https://www.google.com/fusiontables/exporttable?query=select+*+from+1KPXf2JeB6b55BDGVnhmrnjZaMsxpvq76QIscsOA&o=csv' -O ngrams4.csv

download: ngrams1.csv ngrams2.csv ngrams3.csv ngrams4.csv

stats.js: download
	@echo stats = { > stats.js
	@cat ngrams1.csv | normalize.rb 1 >> stats.js
	@echo , >> stats.js
	@cat ngrams2.csv | normalize.rb 2 >> stats.js
	@echo , >> stats.js
	@cat ngrams3.csv | normalize.rb 3 >> stats.js
	@echo } >> stats.js

