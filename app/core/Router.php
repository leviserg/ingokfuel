<?php
	namespace app\core;

	use app\core\View;

	class Router {

		protected $routes = [];
        protected $params = [];
        protected $selectedRoute = [];
		
		public function __construct() {
			$arr = require 'app/config/routes.php';
			foreach ($arr as $key => $val) {
				$this->addRoute($key, $val);
			}
        }

        public function addRoute($route, $params) {
            $route = preg_replace('/{([a-z]+):([^\}]+)}/', '(?P<\1>\2)', $route);
            $route = '#^'.$route.'$#';
			$this->routes[$route] = $params;
		}

		public function matchRoute() {
			$url = trim($_SERVER['REQUEST_URI'], '/');
			foreach ($this->routes as $route => $params) {
				if (preg_match($route, $url, $matches)) {
					foreach ($matches as $key => $match) {
						if (is_string($key)) {
							if (is_numeric($match)) {
								$match = (int) $match;
							}
							$params[$key] = $match;
                        }
					}
                    $this->params = $params;
                    $this->selectedRoute = $this->routes['#^'.$url.'$#'];
					return true;
                }
			}
            return false;
		}
        
		public function run(){
            if ($this->matchRoute()) {
				$viewpath = 'app/views/'.$this->params['view'].'.php';
				if (file_exists($viewpath)) {
					$view = new View($this->params);
					$wr = '';
					if(isset($_SESSION['user']) && count($_SESSION['user'])==0){
						$wr = 'Неверный логин и пароль';
					}
					$vars = [
						'view' => $this->params['view'],
						//'id' => $this->params['id'],
						'wr'=> $wr
					];
                    $view->render(null, $vars);
				} else {
					View::errorCode(403);
				}
			} else {
				View::errorCode(404);
            }
        }
	}