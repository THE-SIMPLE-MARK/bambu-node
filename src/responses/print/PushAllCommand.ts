import { PrintMessageCommand } from "./PrintMessage"
import { StringNumber, StringRange, IntRange } from "src/types"

/**
 * Reports all sensors and statuses of the printer.
 */
export interface PushAllCommand extends PrintMessageCommand {
	ams: {
		// status of all connected AMSs
		ams: [AMS] | [AMS, AMS] | [AMS, AMS, AMS] | [AMS, AMS, AMS, AMS]
		ams_exist_bits: StringNumber
		insert_flag: boolean
		power_on_flag: boolean
		tray_exist_bits: StringNumber
		tray_is_bbl_bits: StringNumber
		tray_now: StringNumber // 254 if external spool / vt_tray, otherwise is ((ams_id * 4) + tray_id) for current tray (ams 2 tray 2 would be (1*4)+1 = 5)
		tray_read_done_bits: StringNumber
		tray_reading_bits: StringNumber
		tray_tar: StringNumber
		version: number
	}
	ams_rfid_status: AmsRFIDStatus
	ams_status: number
	bed_target_temper: number // bed target temperature
	bed_temper: number // bed temperature
	big_fan1_speed: StringRange<0, 100> // auxiliary fan
	big_fan2_speed: StringRange<0, 100> // chamber fan
	chamber_temper: number // interior temperature
	command: "push_status"
	cooling_fan_speed: StringRange<0, 100> // part Cooling fan
	fail_reason: StringNumber
	fan_gear: number
	force_upgrade: boolean // something related to the firmware upgrades
	gcode_file: string // name of the GCODE file that is currently printing, in empty string or {FILENAME}.gcode format
	gcode_file_prepare_percent: StringRange<0, 100>
	gcode_start_time: StringNumber
	gcode_state: "FINISH" | "FAILED" | "RUNNING" | "IDLE" | "PAUSE" | "PREPARE"
	heatbreak_fan_speed: StringRange<0, 100> // smaller fan on the hotend itself
	hms: HMS[]
	home_flag: number
	hw_switch_state: number
	ipcam: {
		ipcam_dev: StringNumber
		ipcam_record: "enable" | "disable"
		mode_bits: 3
		resolution: "720p" | "1080p"
		timelapse: "enable" | "disable"
	}
	layer_num: number // current layer number while printing
	lifecycle: "product" // probably to differentiate between in-house prototypes and production machines
	lights_report: LightReport[] // internal lights
	maintain: number
	mc_percent: IntRange<0, 100> // % of print done
	mc_print_line_number: StringNumber // current line number
	mc_print_error_code: "0" | StringNumber
	mc_print_stage: "1" | "2" | "3"
	mc_print_sub_stage: number
	mc_remaining_time: number // remaining time from print
	mess_production_state: "active" | "inactive" // probably to differentiate between in-house prototypes and production machines
	msg: number
	nozzle_target_temper: number
	nozzle_temper: number
	online: OnlineStatus
	print_error: number
	print_gcode_action: number
	print_real_action: number
	print_type: "cloud" | "system" | "local" | "idle"
	profile_id: StringNumber
	project_id: StringNumber
	queue_est: number
	queue_number: number
	queue_sts: number
	queue_total: number
	s_obj: unknown[]
	sdcard: boolean // is SD card inserted
	sequence_id: StringNumber // related to general MQTT commands, must increment by one each response/request
	spd_lvl: IntRange<1, 5>
	spd_mag: number
	stg: PrintStage[] // x (unknown) amount of previous stages
	stg_cur: PrintStage // current print stage
	subtask_id: StringNumber // 0 when printing from SD card
	subtask_name: string
	task_id: StringNumber
	total_layer_num: number // total layer number of the job
	upgrade_state: UpgradeState
	upload: Upload
	vt_tray: {
		// external spool (tray)
		// this has unused values due to being a copy of the AMS trays
		bed_temp: 0
		bed_temp_type: 0
		cols: StringNumber[]
		drying_temp: 0
		drying_time: 0
		id: 254
		k: number
		n: number
		nozzle_temp_max: number
		nozzle_temp_min: number
		remain: 0
		tag_uid: string
		tray_color: string
		tray_diameter: number
		tray_id_name: string
		tray_info_idx: string
		tray_sub_brands: string
		tray_temp: StringNumber
		tray_time: StringNumber
		tray_type: string
		tray_uuid: string
		tray_weight: 0
		xcam_info: string
	}
	wifi_signal: `-${number}dBm`
	xcam: AIFeatures // AI-related features
	xcam_status: StringNumber
}

// Extracted from https://github.com/bambulab/BambuStudio/blob/7ce38201c8df33b65691c64a3dcec96986eaf665/src/slic3r/GUI/DeviceManager.cpp#L33-L70
enum PrintStage {
	"PRINTING",
	"BED_LEVELING",
	"HEATBED_PREHEATING",
	"XY_MECH_MODE_SWEEP",
	"CHANGE_MATERIAL",
	"M400_PAUSE",
	"FILAMENT_RUNOUT_PAUSE",
	"HOTEND_HEATING",
	"EXTRUDE_COMPENSATION_SCAN",
	"BED_SCAN",
	"FIRST_LAYER_SCAN",
	"BE_SURFACE_TYPT_IDENTIFICATION",
	"SCANNER_EXTRINSIC_PARA_CALI",
	"TOOLHEAD_HOMING",
	"NOZZLE_TIP_CLEANING",
	"EXTRUDER_TEMP_PROTECT_CALI",
	"USER_PAUSE",
	"TOOLHEAD_SHELL_OFF_PAUSE",
	"SCANNER_LASER_PARA_CALI",
	"EXTRUDER_ABSOLUTE_FLOW_CALI",
	"HOTEND_TEMPERATURE_ERROR_PAUSE",
	"HEATED_BED_TEMPERATURE_ERROR_PAUSE",
	"FILAMENT_UNLOADING",
	"SKIP_STEP_PAUSE",
	"FILAMENT_LOADING",
	"MOTOR_NOISE_CALIBRATION",
	"AMS_LOST_PAUSE",
	"HEAT_BREAK_FAN_PAUSE",
	"CHAMBER_TEMPERATURE_CONTROL_ERROR_PAUSE",
	"CHAMBER_COOLING",
	"USER_INSERT_GCODE_PAUSE",
	"MOTOR_NOISE_SHOWOFF",
	"NOZZLE_FILAMENT_COVERED_DETECTED_PAUSE",
	"CUTTER_ERROR_PAUSE",
	"FIRST_LAYER_ERROR_PAUSE",
	"NOZZLE_CLOG_PAUSE",
}

// AMS instance
export interface AMS {
	humidity: string
	id: string
	temp: string
	tray: [
		AMSTray | undefined,
		AMSTray | undefined,
		AMSTray | undefined,
		AMSTray | undefined,
	]
}

// AMS filament slot instance
export interface AMSTray {
	bed_temp: string
	bed_temp_type: string
	drying_temp: string // temperature required for filament drying
	drying_time: string // time required for filament drying
	id: string
	nozzle_temp_max: StringNumber
	nozzle_temp_min: StringNumber
	remain: number
	tag_uid: StringNumber
	tray_color: string
	tray_diameter: string
	tray_id_name: string
	tray_info_idx: string
	tray_sub_brands: string
	tray_type: string
	tray_uuid: string
	tray_weight: string
	xcam_info: string
}

enum AmsRFIDStatus {
	AMS_RFID_IDLE = 0,
	AMS_RFID_READING = 1,
	AMS_RFID_GCODE_TRANS = 2,
	AMS_RFID_GCODE_RUNNING = 3,
	AMS_RFID_ASSISTANT = 4,
	AMS_RFID_SWITCH_FILAMENT = 5,
	AMS_RFID_HAS_FILAMENT = 6,
}

// error code instance
export interface HMS {
	attr: number
	code: number
}

// interior lighting related status instance
export interface LightReport {
	node: "chamber_light" | "work_light"
	mode: "on" | "off" | "flashing"
}

// firmware update related status
export interface UpgradeState {
	ahb_new_version_number: string
	ams_new_version_number: string
	consistency_request: boolean
	dis_state: UpgradeDisplayState // display state
	err_code: number
	force_upgrade: boolean
	message: string
	module: "null" | string
	new_ver_list: string
	new_version_state: number
	ota_new_version_number: string
	progress: StringRange<0, 100>
	sequence_id: number
	status: "IDLE" | string
}

enum UpgradeDisplayState {
	UNAVAILABLE = 0,
	IDLE = 1,
	UPGRADING = 2,
	UPGRADE_FINISHED = 3,
}

// file upload related status
export interface Upload {
	file_size: number
	finish_size: number
	message: string
	oss_url: string
	progress: StringRange<0, 100>
	sequence_id: StringNumber
	speed: number
	status: "idle" | string
	task_id: string
	time_remaining: number
	trouble_id: string
}

export interface AIFeatures {
	allow_skip_parts: boolean
	buildplate_marker_detector: boolean
	first_layer_inspector: boolean
	halt_print_sensitivity: "low" | "medium" | "high"
	print_halt: boolean
	printing_monitor: boolean
	spaghetti_detector: boolean
}

export interface OnlineStatus {
	ahb: boolean
	rfid: boolean
	version: number
}

export function isPushAllCommand(data: PrintMessageCommand): data is PushAllCommand {
	return data.command === "push_status" && Object.keys(data).length >= 40
}
