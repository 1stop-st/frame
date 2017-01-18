<?php

class SimpleTest extends PHPUnit_Framework_TestCase {
    public function testBoolean() {
        $this->assertFalse(False);
    }
}


$con ='{
  "server": "hub-cloud.browserstack.com",

  "capabilities": {
    "browserstack.debug": true
  },

  "environments": [{
    "browser": "chrome"
  }]
}';

$config_file = getenv('CONFIG_FILE');
if(!$config_file) $config_file = 'config/single.conf.json';
$GLOBALS['CONFIG'] = json_decode($con, true);

$GLOBALS['BROWSERSTACK_USERNAME'] = getenv('BROWSERSTACK_USERNAME');
if(!$GLOBALS['BROWSERSTACK_USERNAME']) $GLOBALS['BROWSERSTACK_USERNAME'] = $CONFIG['user'];

$GLOBALS['BROWSERSTACK_ACCESS_KEY'] = getenv('BROWSERSTACK_ACCESS_KEY');
if(!$GLOBALS['BROWSERSTACK_ACCESS_KEY']) $GLOBALS['BROWSERSTACK_ACCESS_KEY'] = $CONFIG['key'];

class BrowserStackTest extends PHPUnit_Framework_TestCase
{
    protected static $driver;
    protected static $bs_local;

    public static function setUpBeforeClass()
    {
        $CONFIG = $GLOBALS['CONFIG'];
        $task_id = getenv('TASK_ID') ? getenv('TASK_ID') : 0;

        $url = "https://" . $GLOBALS['BROWSERSTACK_USERNAME'] . ":" . $GLOBALS['BROWSERSTACK_ACCESS_KEY'] . "@" . $CONFIG['server'] ."/wd/hub";
        $caps = $CONFIG['environments'][$task_id];

        foreach ($CONFIG["capabilities"] as $key => $value) {
            if(!array_key_exists($key, $caps))
                $caps[$key] = $value;
        }

        if(array_key_exists("browserstack.local", $caps) && $caps["browserstack.local"])
        {
            $bs_local_args = array("key" => $GLOBALS['BROWSERSTACK_ACCESS_KEY']);
            self::$bs_local = new BrowserStack\Local();
            self::$bs_local->start($bs_local_args);
        }

        self::$driver = RemoteWebDriver::create($url, $caps);
    }

    public static function tearDownAfterClass()
    {
        self::$driver->quit();
        if(self::$bs_local) self::$bs_local->stop();
    }
}
