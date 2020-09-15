import * as fs from "fs";
import * as types from "./types";

const CONFIG_FILE = ".analytics-config.json";

function configPath() {
    const env_directory = process.env.ANALYTICS_HOME;

    const cur_path = "./" + CONFIG_FILE;
    const env_path = `${env_directory}/${CONFIG_FILE}`;

    if (fs.existsSync(cur_path)) {
        return cur_path;
    }

    if (env_directory && fs.existsSync(env_path)) {
        return env_path;
    }

    return;
}

export function loadConfig(network?: types.Network) {
    const config_path = configPath();

    if (!fs.existsSync(config_path)) {
        console.warn("Configuration file not found");
        return;
    }

    try {
        const config_json = fs.readFileSync(config_path);
        const parsed = JSON.parse(config_json.toString());

        if (!network) network = parsed["defaultNetwork"] as types.Network;

        const network_config = parsed["network"][network];

        const config: types.Config = {
            network: network,
            rest_api_address: network_config["REST_API_ADDR"],
            operator_commit_address: network_config["OPERATOR_COMMIT_ETH_ADDRESS"],
            operator_fee_address: network_config["OPERATOR_FEE_ETH_ADDRESS"],
            etherscan_api_address: network_config["ETHERSCAN_API_KEY"],
        };
        if (network_config["WEB3_URL"]) config.web3_url = network_config["WEB3_URL"];

        return config;
    } catch (err) {
        console.warn("Invalid Configuration file");
        return;
    }
}
