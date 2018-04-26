/** Copied from https://github.com/durquhart/T3Tutor
 *  Thanks for the GPLv3!
 */
function TwiddlerConfigV5(byteString)
{
		//create a very simple binary reader
		byteReader = {};
		byteReader.string = byteString;
		byteReader.i = 0;
		byteReader.readByte = function(n){
			if(n === undefined)
				return this.string.charCodeAt(this.i++);
			return this.string.charCodeAt(n);
		};
		byteReader.readWord = function(n){
			//little-endian words
			if(n === undefined)
				return this.readByte() + this.readByte()*256;
			return this.readByte(n) + this.readByte(n+1)*256;
		};
		byteReader.readLongWord = function(){
			//little-endian words
			return this.readByte() + this.readByte()*256 + this.readByte()*256*256 + this.readByte()*256*256*256;
		};
		
		this.numStrings = 0;
		this.header = this.parseHeader(byteReader);
		this.chords = this.parseChords(byteReader);
		this.strings = this.parseStrings(byteReader);
		this.toChord = {};

		var chordsUsed = {};
		for(var i = 0; i < this.chords.length; i++)
			chordsUsed[this.chords[i].representation] = this.chords[i].text;
		
		for(c of this.chords)
		{
			if(! c.text)
			{
				continue;
			}
			var a = c.text[0];
			//don't overwrite - except prefer no modifier
			if(((c.modifier & 0x20) == 0 || !c.text[1]) && (!this.toChord[a]||
			((this.toChord[a].representation & 0x1111) > (c.representation & 0x1111)) ||
			((this.toChord[a].modifier) > (c.modifier))
			))
			{
				this.toChord[a] = c;
			}

			// Allow a shifted character if there's no explicit code for shift with that combo
			if(c.text[1] && ((c.modifier & 0x20) || ((c.representation & 0x1000) == 0) && !chordsUsed[c.representation | 0x1000])) {
				var a = c.text[1];

				if(!this.toChord[a]||
				((this.toChord[a].representation & 0x1111)) > ((c.representation & 0x1111) | ((c.modifier & 0x20) ? 0 : 0x1000)))
				{
					if(c.modifier & 0x20)
						this.toChord[a] = c;
					else {
						this.toChord[a] = Object.assign({}, c);
						this.toChord[a].representation |= 0x1000;
						this.toChord[a].chord = Object.assign({}, this.toChord[a].chord)
						this.toChord[a].chord[0] = Object.assign({}, this.toChord[a].chord[0])
						this.toChord[a].chord[0][3] = true;
					}
				}
			}
		}

};

TwiddlerConfigV5.prototype.parseChords = function(byteReader)
{
	hidMap = new HidMap();
	chords = [];
	for(var i = 0; i < this.header.chordCount; i++)
	{
		rep = byteReader.readWord();
		modifier = byteReader.readByte();
		key = byteReader.readByte();
		node = { "representation": rep, "modifier":modifier,"key":key };
		if(node.modifier == 255) {
			if(key >= this.numStrings)
				this.numStrings = key + 1;
		}
		else
		{
			node.text = hidMap.fromHidList(key);
		}
		node.chord = this.decodeChord(rep);
		chords.push( node );
	}
	return chords;
}
TwiddlerConfigV5.prototype.parseHeader = function(byteReader)
{
		var header = {};
		header.version = byteReader.readByte();
		header.options = byteReader.readByte();
		header.chordCount = 	byteReader.readWord();
		header.sleepTimeout = 	byteReader.readWord();
		header.mousrLeft = 	byteReader.readWord();
		header.mouseRight = 	byteReader.readWord();
		header.mouseMiddle = 	byteReader.readWord();
		header.mouseAccel = 	byteReader.readByte();
		header.keyRepeatDelay = 	byteReader.readByte();
		header.reserved = 	byteReader.readWord();
		return header;
};
TwiddlerConfigV5.prototype.parseStrings = function(byteReader)
{
	var strings = {};
	for(var i = 0; i < this.numStrings; i++)
	{
		var pos = byteReader.readLongWord();
		var len = byteReader.readWord(pos);

		strings[i] = ""
		for(var c = pos + 2; c < pos + len; c += 2) {
			var modifier = byteReader.readByte(c);
			var key = byteReader.readByte(c+1);
			var hidKeys = hidMap.fromHidList(key)
			if(modifier & 0x20 && hidKeys.length > 1)
				strings[i] = strings[i] + hidKeys[1];
			else
				strings[i] = strings[i] + hidKeys[0];
		}

	}
	return strings;
}

TwiddlerConfigV5.prototype.buttonTemplate = function()
{
		return[ ["Num","Alt","CTL","SFT"],["A","E","SP"],["B","F","DEL"],["C","G","BS"],["D","H","ENT"]];
}

TwiddlerConfigV5.prototype.decodeChord = function(word)
{
	
	chord = this.buttonTemplate();
	for(i = 0; i < 16; i++)
	{
		val = (word & (0x01<<i)) != 0;
		if(i%4 == 0)
		{
			chord[0][i>>2] = val;
		}
		else
		{
			chord[1+(i>>2)][(i%4)-1] = val;
		}
	}
	return chord;
};

TwiddlerConfigV5.prototype.prettyChord = function(chord)
{
	template = this.buttonTemplate();
	
	result =[];
	for(var r = 0; r < chord.length; r++)
	{
		var row = chord[r];
		result.push(r==0?"":"|");
		for(var c = 0; c < row.length; c++)
		{
			var txt = row[c]?(r==0?template[r][c]:"X"):" "
			result.push(txt);
			result.push(r==0?"":"|");
		}
		result.push("\n");//-------\n");
	}
	return result.join("");
};
	

