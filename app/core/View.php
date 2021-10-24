<?php

namespace app\core;

class View {

	public $path;
	public $route;

	public function __construct($route) {
		$this->route = $route;
		$this->path = $route['view']; //$route['view'].'/'.$route['action'];
	}

	public function render($title = null, $vars = []) {
		extract($vars);
		$path = 'app/views/'.$this->path.'.php';
		if (file_exists($path)) {
            ob_start();            
			require $path;
            $content = ob_get_clean();
            require 'app/layout.php';
		}
    }

	public function redirect($url) {
		header('location: /'.$url);
		exit;
	}

	public static function errorCode($code) {
		http_response_code($code);
		$path = 'app/views/errors/'.$code.'.php';
		if (file_exists($path)) {
			require $path;
		}
		exit;
    }
    
/*
	public function message($status, $message) {
		exit(json_encode(['status' => $status, 'message' => $message]));
	}

	public function location($url) {
		exit(json_encode(['url' => $url]));
	}
*/
}	