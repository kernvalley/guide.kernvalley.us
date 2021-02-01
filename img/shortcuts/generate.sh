#! /bin/bash
declare -ar sizes=(192 32)
declare -r here=`dirname $0`

if command -v inkscape &> /dev/null; then
	for svg in $(ls ./${here}/*.svg); do
		for size in $sizes; do
			inkscape "${svg}" -h $size -e "${svg%.svg}-${size}.png"
		done
	done
fi
