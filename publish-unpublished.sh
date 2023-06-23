workspacesPath=$(npm pkg get workspaces.0 | head -n 1);
workspacesPath=${workspacesPath:1:-1};
for ws in $(realpath $(dirname $0))/${workspacesPath}; do
	cd ${ws};
	name=$(npm pkg get name | head -n 1);
	name=${name:1:-1}; # remove quotes
	version=$(npm pkg get version | head -n 1);
	version=${version:1:-1}; # remove quotes
	if [[ $(npm view ${name}@${version}) ]]; then
		echo "${name}@${version} is already published, skip";
	else
		echo "${name}@${version} is not published yet, let's do it";
		npm publish;
	fi;
done;
