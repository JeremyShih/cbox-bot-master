const LISTEN = true;
const PID_FILE = './cboxbot.pid';

var box = { 'srv': 4, 'id': 4337255, 'tag': 'mtukb5' };
var bot = { 'name': '測試機器人', 'token': 'V1HFuiJdWGgBTbcU', 'url': '' };
var msg = 'Hello world OWO';

var callMap = {
	'hello bot': bot_greet(msg),
	'time?': bot_time(),
	'weather in ([a-zA-Z-0-9 ,]+)': 'bot_weather',
	'解壓縮密碼': '僅限學術使用，分享於JA',
	'掰掰': 'bot_bye',
	'~': '~~~',
}

function bot_time () {
	return new Date();
}

// An example incorporating message data. 
function bot_greet (msg) {
	return "Hello " + msg['name'];
}
function bot_bye (msg) {
	return "byebye " + msg['name'];
}

// set_time_limit(0);

var id = cbox_post(msg, bot, box, error);

if (!id) {
	console.log(error);
}
else {
	console.log("Posted ID " + id + "\n");
}

if (!LISTEN) {
	exit;
}

// 寫錯誤代碼輸出log
// $fp = fopen(PID_FILE, 'a+');
// if (!flock($fp, LOCK_EX | LOCK_NB)) {
// 	echo "Could not lock PID file. Process already running?\n"; 
// 	exit;
// }
// ftruncate($fp, 0);
// fwrite($fp, posix_getpid()."\n");
// fflush($fp);

do {


} while(true);

function cbox_get_msgs (id, user, box, error = '') {
	var srv = box['srv'];
	var boxid = box['id'];
	var boxtag = box['tag'];
	
	var host = "www" + srv + ".cbox.ws";
	var path = "/box/?boxid=" + boxid + "&boxtag=" + boxtag + "&sec=archive";
	var port = 80;
	var timeout = 30;

	var get = {
		'i': parseInt(id),
		'k': user['token'],
		'fwd': 1,
		'aj': 1
	};	

	var req = '';
	var res = '';
	
	for (var key in get) {
		path += "&" + key + "=" + encodeURIComponent(get[key]);
	}
	
	var hdr  = "GET " + path + " HTTP/1.1\r\n";
	hdr += "Host: " + host + "\r\n\r\n";
	
	$fp = fsockopen ($host, $port, $errno, $errstr, $timeout);

	if (!$fp) {
		$error = "Could not open socket: $errno - $errstr\n";
		return;
	}

	fputs ($fp, $hdr);
	
	while (!feof($fp)) {
		$res .= fgets ($fp, 1024);
	}
	
	fclose ($fp);

	if (!$res || !strpos($res, "200 OK")) {
		$error = "Bad response:\r\n $res";
		return;
	}

	$matches = array();

	preg_match_all('/\n([^\t\n]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t'.'([^\t]*)\t([^\t]*)\t([^\t]*)\t([^\t]*)\t/', $res, $matches);

	$msgs = array();

	$map = array('id', 'time', 'date', 'name', 'group', 'url', 'message');

	for ($m = 0; $m < count($map); $m++) {
		for ($i = 0; $i < count($matches[$m+1]); $i++) {
			$msgs[$i][$map[$m]] = $matches[$m+1][$i];
		}
	}

	return $msgs;
}