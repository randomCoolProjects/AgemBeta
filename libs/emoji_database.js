var cp_start = 0x1F600;
var cp_len = 80;

function getEmoji(index)
{
    return String.fromCodePoint(cp_start + index);
}