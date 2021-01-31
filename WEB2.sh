#!/bin/bash
#
# Test the JMeter Docker image using a trivial test plan.

# Example for using User Defined Variables with JMeter
# These will be substituted in JMX test script
# See also: http://stackoverflow.com/questions/14317715/jmeter-changing-user-defined-variables-from-command-line

export TARGET_TOKEN="7004ded24f43a4450968747fa79f06de8ecc4286da"
export TARGET_THREADS="250"
export TARGET_LOOPS="2"
export TARGET_TIME="60"

T_DIR=tests/compra2

# Reporting dir: start fresh
R_DIR=${T_DIR}/report-$(date +"%F-%H-%M")
rm -rf ${R_DIR} > /dev/null 2>&1
mkdir -p ${R_DIR}

/bin/rm -f ${T_DIR}/test-plan.jtl ${T_DIR}/jmeter.log  > /dev/null 2>&1

./run2.sh -Dlog_level.jmeter=DEBUG \
	-JTARGET_THREADS=${TARGET_THREADS} -JTARGET_TOKEN=${TARGET_TOKEN} \
	-JTARGET_TIME=${TARGET_TIME} -JTARGET_LOOPS=${TARGET_LOOPS} \
	-n -t ${T_DIR}/PSWRSV-2021.jmx -l ${T_DIR}/test-plan.jtl -j ${T_DIR}/jmeter.log \
	-e -o ${R_DIR}

echo "==== jmeter.log ===="
cat ${T_DIR}/jmeter.log

echo "==== Raw Test Report ===="
cat ${T_DIR}/test-plan.jtl

echo "==== HTML Test Report ===="
echo "See HTML test report in ${R_DIR}/index.html"
