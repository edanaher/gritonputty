/** Copied from https://github.com/durquhart/T3Tutor
 *  Thanks for the GPLv3!
 */
/** A simple map from USB HID values to text representations */
function HidMap()
{
	this.initData();
}
HidMap.prototype.fromHid = function(code, /*bool*/shift)
{
	index = shift?1:0;
	if(this.hidMap[code] && this.hidMap[code][index])
	{
		return this.hidMap[code][index];
	}
	return "UNKOWN";
}

HidMap.prototype.fromHidList = function(code)
{
	if(this.hidMap[code])
	{
		return this.hidMap[code];
	}
}

HidMap.prototype.initData = function()
{
	this.hidMap = {};
	//this.hidMap[0x00	Reserved (no event indicated)
	//this.hidMap[0x01	Keyboard ErrorRollOver
	this.hidMap[0x02] = ["POSTFail"];
	this.hidMap[0x03] = ["ErrorUndefined"];
	this.hidMap[0x04] = ["a","A"];
	this.hidMap[0x05] = ["b","B"];
	this.hidMap[0x06] = ["c","C"];
	this.hidMap[0x07] = ["d","D"];
	this.hidMap[0x08] = ["e","E"];
	this.hidMap[0x09] = ["f","F"];
	this.hidMap[0x0A] = ["g","G"];
	this.hidMap[0x0B] = ["h","H"];
	this.hidMap[0x0C] = ["i","I"];
	this.hidMap[0x0D] = ["j","J"];
	this.hidMap[0x0E] = ["k","K"];
	this.hidMap[0x0F] = ["l","L"];
	this.hidMap[0x10] = ["m","M"];
	this.hidMap[0x11] = ["n","N"];
	this.hidMap[0x12] = ["o","O"];
	this.hidMap[0x13] = ["p","P"];
	this.hidMap[0x14] = ["q","Q"];
	this.hidMap[0x15] = ["r","R"];
	this.hidMap[0x16] = ["s","S"];
	this.hidMap[0x17] = ["t","T"];
	this.hidMap[0x18] = ["u","U"];
	this.hidMap[0x19] = ["v","V"];
	this.hidMap[0x1A] = ["w","W"];
	this.hidMap[0x1B] = ["x","X"];
	this.hidMap[0x1C] = ["y","Y"];
	this.hidMap[0x1D] = ["z","Z"];
	this.hidMap[0x1E] = ["1","!"];
	this.hidMap[0x1F] = ["2","@"];
	this.hidMap[0x20] = ["3","#"];
	this.hidMap[0x21] = ["4","$"];
	this.hidMap[0x22] = ["5","%"];
	this.hidMap[0x23] = ["6","^"];
	this.hidMap[0x24] = ["7","&"];
	this.hidMap[0x25] = ["8","*"];
	this.hidMap[0x26] = ["9","("];
	this.hidMap[0x27] = ["0",")"];
	this.hidMap[0x28] = ["Return (ENTER)"];
	this.hidMap[0x29] = ["ESCAPE"];
	this.hidMap[0x2A] = ["DELETE (Backspace)"];
	this.hidMap[0x2B] = ["Tab"];
	this.hidMap[0x2C] = [" "];
	this.hidMap[0x2D] = ["-","_"];
	this.hidMap[0x2E] = ["=","+"];
	this.hidMap[0x2F] = ["[","{"];
	this.hidMap[0x30] = ["]","}"];
	this.hidMap[0x31] = ["\\","|"];
	this.hidMap[0x32] = ["Non-US #","~"];
	this.hidMap[0x33] = [";",":"];
	this.hidMap[0x34] = ["'","\""];
	this.hidMap[0x35] = ["`","~"];
	this.hidMap[0x36] = [",","<"];
	this.hidMap[0x37] = [".",">"];
	this.hidMap[0x38] = ["/","?"];
	this.hidMap[0x39] = ["Caps Lock"];
	this.hidMap[0x3A] = ["F1"];
	this.hidMap[0x3B] = ["F2"];
	this.hidMap[0x3C] = ["F3"];
	this.hidMap[0x3D] = ["F4"];
	this.hidMap[0x3E] = ["F5"];
	this.hidMap[0x3F] = ["F6"];
	this.hidMap[0x40] = ["F7"];
	this.hidMap[0x41] = ["F8"];
	this.hidMap[0x42] = ["F9"];
	this.hidMap[0x43] = ["F10"];
	this.hidMap[0x44] = ["F11"];
	this.hidMap[0x45] = ["F12"];
	this.hidMap[0x46] = ["PrintScreen"];
	this.hidMap[0x47] = ["Scroll Lock"];
	this.hidMap[0x48] = ["Pause"];
	this.hidMap[0x49] = ["Insert"];
	this.hidMap[0x4A] = ["Home"];
	this.hidMap[0x4B] = ["PageUp"];
	this.hidMap[0x4C] = ["Delete Forward"];
	this.hidMap[0x4D] = ["End"];
	this.hidMap[0x4E] = ["PageDown"];
	this.hidMap[0x4F] = ["RightArrow"];
	this.hidMap[0x50] = ["LeftArrow"];
	this.hidMap[0x51] = ["DownArrow"];
	this.hidMap[0x52] = ["UpArrow"];
	this.hidMap[0x53] = ["Num Lock","Clear"];
	this.hidMap[0x54] = ["/"];
	this.hidMap[0x55] = ["*"];
	this.hidMap[0x56] = ["-"];
	this.hidMap[0x57] = ["+"];
	this.hidMap[0x58] = ["ENTER"];
	this.hidMap[0x59] = ["1","End"];
	this.hidMap[0x5A] = ["2","Down Arrow"];
	this.hidMap[0x5B] = ["3","PageDn"];
	this.hidMap[0x5C] = ["4","Left Arrow"];
	this.hidMap[0x5D] = ["5"];
	this.hidMap[0x5E] = ["6","Right Arrow"];
	this.hidMap[0x5F] = ["7","Home"];
	this.hidMap[0x60] = ["8","Up Arrow"];
	this.hidMap[0x61] = ["9","PageUp"];
	this.hidMap[0x62] = ["0","Insert"];
	this.hidMap[0x63] = [".","Delete"];
	this.hidMap[0x64] = ["Non-US \\","|"];
	this.hidMap[0x65] = ["Application"];
	this.hidMap[0x66] = ["Power"];
	this.hidMap[0x67] = ["="];
	this.hidMap[0x68] = ["F13"];
	this.hidMap[0x69] = ["F14"];
	this.hidMap[0x6A] = ["F15"];
	this.hidMap[0x6B] = ["F16"];
	this.hidMap[0x6C] = ["F17"];
	this.hidMap[0x6D] = ["F18"];
	this.hidMap[0x6E] = ["F19"];
	this.hidMap[0x6F] = ["F20"];
	this.hidMap[0x70] = ["F21"];
	this.hidMap[0x71] = ["F22"];
	this.hidMap[0x72] = ["F23"];
	this.hidMap[0x73] = ["F24"];
	this.hidMap[0x74] = ["Execute"];
	this.hidMap[0x75] = ["Help"];
	this.hidMap[0x76] = ["Menu"];
	this.hidMap[0x77] = ["Select"];
	this.hidMap[0x78] = ["Stop"];
	this.hidMap[0x79] = ["Again"];
	this.hidMap[0x7A] = ["Undo"];
	this.hidMap[0x7B] = ["Cut"];
	this.hidMap[0x7C] = ["Copy"];
	this.hidMap[0x7D] = ["Paste"];
	this.hidMap[0x7E] = ["Find"];
	this.hidMap[0x7F] = ["Mute"];
	this.hidMap[0x80] = ["Volume Up"];
	this.hidMap[0x81] = ["Volume Down"];
	this.hidMap[0x82] = ["Locking Caps Lock"];
	this.hidMap[0x83] = ["Locking Num Lock"];
	this.hidMap[0x84] = ["Locking Scroll Lock"];
	this.hidMap[0x85] = [","];
	this.hidMap[0x86] = ["="];
	this.hidMap[0x87] = ["International1"];
	this.hidMap[0x88] = ["International2"];
	this.hidMap[0x89] = ["International3"];
	this.hidMap[0x8A] = ["International4"];
	this.hidMap[0x8B] = ["International5"];
	this.hidMap[0x8C] = ["International6"];
	this.hidMap[0x8D] = ["International7"];
	this.hidMap[0x8E] = ["International8"];
	this.hidMap[0x8F] = ["International9"];
	this.hidMap[0x90] = ["LANG1"];
	this.hidMap[0x91] = ["LANG2"];
	this.hidMap[0x92] = ["LANG3"];
	this.hidMap[0x93] = ["LANG4"];
	this.hidMap[0x94] = ["LANG5"];
	this.hidMap[0x95] = ["LANG6"];
	this.hidMap[0x96] = ["LANG7"];
	this.hidMap[0x97] = ["LANG8"];
	this.hidMap[0x98] = ["LANG9"];
	this.hidMap[0x99] = ["Alternate Erase"];
	this.hidMap[0x9A] = ["SysReq/Attention"];
	this.hidMap[0x9B] = ["Cancel"];
	this.hidMap[0x9C] = ["Clear"];
	this.hidMap[0x9D] = ["Prior"];
	this.hidMap[0x9E] = ["Return"];
	this.hidMap[0x9F] = ["Separator"];
	this.hidMap[0xA0] = ["Out"];
	this.hidMap[0xA1] = ["Oper"];
	this.hidMap[0xA2] = ["Clear/Again"];
	this.hidMap[0xA3] = ["CrSel/Props"];
	this.hidMap[0xA4] = ["ExSel"];
	this.hidMap[0xE0] = ["LeftControl"];
	this.hidMap[0xE1] = ["LeftShift"];
	this.hidMap[0xE2] = ["LeftAlt"];
	this.hidMap[0xE3] = ["Left GUI"];
	this.hidMap[0xE4] = ["RightControl"];
	this.hidMap[0xE5] = ["RightShift"];
	this.hidMap[0xE6] = ["RightAlt"];
	this.hidMap[0xE7] = ["Right GUI"];
}
