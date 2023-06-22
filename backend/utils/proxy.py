import os.path
import subprocess
import api.globals as g
config = g.config
import api.globals as g

from utils.logger import get_logger

logger = get_logger(__name__)


def run_reverse_proxy():
    if not config.get("chatgpt_paid", False):
        logger.error("You need a ChatGPT Plus account to use the reverse proxy!")
        logger.error("Please set chatgpt_paid to true in config.yaml and restart the server.")
        exit(1)

    proxy_path = config.get("reverse_proxy_binary_path", None)
    if not proxy_path:
        logger.error("You need to set the reverse proxy binary path in config.yaml!")
        exit(1)

    puid = config.get("reverse_proxy_puid")
    env_vars = {"PORT": str(config.get("reverse_proxy_port", 6060))}
    http_proxy = config.get("reverse_proxy_http_proxy")
    if puid:
        env_vars["PUID"] = puid
    if config.get("auto_refresh_reverse_proxy_puid"):
        env_vars["ACCESS_TOKEN"] = config.get("chatgpt_access_token")
    if http_proxy:
        env_vars["http_proxy"] = http_proxy
        logger.info(f"Reverse proxy Using http proxy: {http_proxy}")
    g.reverse_proxy_log_file = open(os.path.join(config.get("log_dir", "logs"), "reverse_proxy.log"), "w",
                                    encoding="utf-8")
    logger.debug(f"Reverse proxy binary path: {proxy_path}")
    g.reverse_proxy_process = subprocess.Popen([proxy_path], env=env_vars, stdout=g.reverse_proxy_log_file,
                                               stderr=g.reverse_proxy_log_file)
    logger.info("Reverse proxy started!")


def close_reverse_proxy():
    if g.reverse_proxy_process:
        g.reverse_proxy_process.kill()
        g.reverse_proxy_process = None
        g.reverse_proxy_log_file.close()
        g.reverse_proxy_log_file = None
        logger.info("Reverse proxy stopped.")
