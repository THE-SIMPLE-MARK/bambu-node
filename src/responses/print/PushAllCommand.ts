import { PrintMessageCommand } from "./PrintMessage"
import { StringNumber, StringNumberRange, NumberRange } from "src/types"

/**
 * Reports all sensors and statuses of the printer.
 */
export interface PushAllCommand extends PrintMessageCommand {
	/**
	 * Status of all connected AMSes.
	 */
	ams: {
		ams: [AMS] | [AMS, AMS] | [AMS, AMS, AMS] | [AMS, AMS, AMS, AMS]
		/**
		 * Unknown.
		 *
		 * Probably used for checking for new AMSes.
		 */
		ams_exist_bits: StringNumber
		/**
		 * Unknown.
		 *
		 * Could possibly be related to storing whether the filament's data has been read from the AMSes.
		 */
		insert_flag: boolean
		/**
		 * Exact definition is unknown, but it appears to be used for checking if all filaments have been read since startup or not.
		 */
		power_on_flag: boolean
		/**
		 * Unknown.
		 *
		 * Probably used for checking for new AMSes.
		 */
		tray_exist_bits: StringNumber
		/**
		 * Unknown.
		 *
		 * Probably used for checking for new AMSes.
		 */
		tray_is_bbl_bits: StringNumber
		/**
		 * Current tray selected by all AMSes.
		 * - 254: external spool (vt_tray)
		 * - otherwise: ((ams_id * 4) + tray_id) for current tray
		 *
		 * @example Ams 2 tray 2 would be: (1*4)+1 = 5.
		 */
		tray_now: StringNumber
		/**
		 * Unknown.
		 *
		 * Probably used for checking which filament slots (trays) have already been read.
		 */
		tray_read_done_bits: StringNumber
		/**
		 * Unknown.
		 *
		 * Probably used for signalling which filament slots (trays) are currently being read.
		 */
		tray_reading_bits: StringNumber
		/**
		 * Unknown. Bambu Studio appears to do nothing with it.
		 */
		tray_tar: StringNumber
		/**
		 * Unknown.
		 *
		 * Could possibly be related to the AMS UI on the X1 series and in Bambu Studio.
		 */
		version: number
	}
	/**
	 * The RFID reader status of the connected AMSes.
	 */
	ams_rfid_status: AmsRFIDStatus
	/**
	 * The AMS status.
	 *
	 * How to extract it: https://github.com/bambulab/BambuStudio/blob/f96b6cd433cf925e9759260925cd2142abf298ef/src/slic3r/GUI/DeviceManager.cpp#L736-L759
	 *
	 * TODO: Extract when received from printer / provide helper function to do so.
	 */
	ams_status: number
	/**
	 * The target temperature of the printing bed in Celsius.
	 */
	bed_target_temper: number // bed target temperature
	/**
	 * The temperature of the printing bed in Celsius.
	 */
	bed_temper: number // bed temperature
	/**
	 * Speed of the auxiliary fan in %.
	 */
	big_fan1_speed: StringNumberRange<0, 100>
	/**
	 * Speed of the chamber fan in %.
	 */
	big_fan2_speed: StringNumberRange<0, 100>
	/**
	 * Interior chamber temperature.
	 */
	chamber_temper: number
	/**
	 * Unknown. Bambu Studio checks for it but doesn't actually use it.
	 *
	 * Could possibly be related to the temperature regulation feature of the X1E.
	 */
	frame_temper: number
	/**
	 * The command the response corresponds to.
	 */
	command: "push_status"
	/**
	 * Speed of the part cooling fan in %.
	 */
	cooling_fan_speed: StringNumberRange<0, 100>
	/**
	 * Unknown. Bambu Studio doesn't even check for it.
	 */
	fail_reason: StringNumber
	/**
	 * Contains the current speed of all the fans
	 *
	 * How to extract it: https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L3273-L3279
	 *
	 * TODO: Extract when received from printer / provide helper function to do so.
	 */
	fan_gear: number
	/**
	 * Something related to the firmware upgrades.
	 */
	force_upgrade: boolean
	/**
	 * Name of the GCode file that is currently printing as an empty string or in {FILENAME}.gcode format.
	 */
	gcode_file: string
	/**
	 * % of GCode prepared (sliced?)
	 */
	gcode_file_prepare_percent: StringNumberRange<0, 100>
	/**
	 * Epoch time when the print started.
	 */
	gcode_start_time: StringNumber
	/**
	 * The current status of the printer.
	 */
	gcode_state: PrinterStatus
	/**
	 * Fan speed in %
	 *
	 * Heatbreak fan: The smaller fan on the hotend itself
	 */
	heatbreak_fan_speed: StringNumberRange<0, 100>
	/**
	 * Bambu Lab's proprietary Health Management System (HMS)
	 *
	 * More info: https://wiki.bambulab.com/en/x1/troubleshooting/intro-hms
	 *
	 * All error codes: https://wiki.bambulab.com/en/hms/home
	 */
	hms: HMS[]
	/**
	 * This single property houses a lot of data regarding the printer.
	 * There's currently no documentation for it except Bambu Studio's source code:
	 *
	 * - Check if axes are homed: https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1255-L1269
	 * - Check if printer is using 220V: https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1346-L1351
	 * - Check if camera is currently recording: https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1353
	 * - Check if AI camera detected filament entanglement: https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1368
	 * - Check if motor noise cancellation has been calibrated: https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1376-L1378
	 * - Check if the current machine is a P1P and has the enclosure enabled: https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1380-L1387
	 * - Check current SD card state (has a lot more info than the sdcard property): https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1389
	 * - Check if printer is using wired network (ethernet; X1E exclusive): https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1391
	 */
	home_flag: number
	hw_switch_state: number
	/**
	 * The printer's onboard camera.
	 */
	ipcam: {
		/**
		 * 0: Doesn't have camera
		 * 1: Has camera
		 */
		ipcam_dev: StringNumberRange<0, 1>
		/**
		 * Whether recording while printing is enabled.
		 */
		ipcam_record: "enable" | "disable"
		/**
		 * Unknown. Bambu Studio doesn't even check for it.
		 */
		mode_bits: 3
		/**
		 * The camera's resolution
		 */
		resolution: "720p" | "1080p"
		/**
		 * Whether creating a timelapse while printing is enabled.
		 */
		timelapse: "enable" | "disable"
	}
	/**
	 * Current layer number while printing.
	 */
	layer_num: number
	/**
	 * Probably to differentiate between in-house prototypes and production machines.
	 */
	lifecycle: "product" | "engineer"
	/**
	 * Internal light states
	 */
	lights_report: LightReport[]
	/**
	 * Unknown. Bambu Studio doesn't even check for it.
	 */
	maintain: number
	/**
	 * % of print done
	 */
	mc_percent: NumberRange<0, 100>
	/**
	 * Unknown. Bambu Studio appears to do nothing with it.
	 *
	 * Perhaps the current GCode line while printing?
	 */
	mc_print_line_number: StringNumber
	/**
	 * Unknown. Bambu Studio appears to do nothing with it.
	 */
	mc_print_error_code: "0" | StringNumber
	/**
	 * Something to do with signalling if calibration is done according to source code
	 *
	 * https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1331-L1342
	 */
	mc_print_stage: StringNumberRange<1, 3>
	/**
	 * Unknown. Bambu Studio appears to do nothing with it.
	 */
	mc_print_sub_stage: number
	/**
	 * Remaining time from print.
	 */
	mc_remaining_time: number
	/**
	 * Probably to differentiate between in-house prototypes and production machines
	 */
	mess_production_state: "active" | "inactive"
	/**
	 * - 0: Full (pushAll) message
	 * - 1: Partial (pushStatus) "difference" message (only changed properties are sent)
	 *
	 * @deprecated Unavailable on the X1 series.
	 *  You can instead use isPushAllCommand or isPushStatusCommand from /responses or create a new PushAllCommand and PushStatus command from /commands and use their ownsResponse method.
	 */
	msg: NumberRange<0, 1>
	/**
	 * The target temperature of the nozzle in Celsius.
	 */
	nozzle_target_temper: number
	/**
	 * The temperature of the nozzle in Celsius.
	 */
	nozzle_temper: number
	/**
	 * Signals the status of some components of the printer and/or accessories.
	 */
	online: {
		/**
		 * Unknown.
		 */
		ahb: boolean
		/**
		 * The RFID reader.
		 */
		rfid: boolean
		/**
		 * Unknown.
		 */
		version: number
	}
	/**
	 * Unknown. Some error code standard which isn't defined in Bambu Studio.
	 *
	 * These codes can be cleared using `system.clean_print_error` command.
	 */
	print_error: number
	/**
	 * Unknown. Bambu Studio doesn't even check for it.
	 */
	print_gcode_action: number
	/**
	 * Unknown. Bambu Studio doesn't even check for it.
	 */
	print_real_action: number
	/**
	 * Where the print originates from.
	 */
	print_type: "cloud" | "system" | "local" | "idle"
	/**
	 * Unknown. Something related to what's being printed.
	 */
	profile_id: StringNumber
	/**
	 * Unknown. Something related to what's being printed.
	 */
	project_id: StringNumber
	/**
	 * Unknown. Something related to a print queue. (?)
	 */
	queue_est: number
	/**
	 * Unknown. Something related to a print queue. (?)
	 */
	queue_number: number
	/**
	 * Unknown. Something related to a print queue. (?)
	 */
	queue_sts: number
	/**
	 * Unknown. Something related to a print queue. (?)
	 */
	queue_total: number
	/**
	 * Objects that have been skipped by the printer while printing,
	 */
	s_obj: unknown[]
	/**
	 * Whether the SD card is inserted.
	 */
	sdcard: boolean
	/**
	 * Related to general MQTT commands on all Bambu Lab printers. Incremented by one each response/request.
	 */
	sequence_id: StringNumber
	/**
	 * The current speed level.
	 */
	spd_lvl: SpeedLevel
	/**
	 * The current speed level in %.
	 */
	spd_mag: NumberRange<50, 166>
	/**
	 * An x (unknown) amount of previous stages.
	 */
	stg: PrintStage[]
	/**
	 * The current print stage.
	 */
	stg_cur: PrintStage
	/**
	 * Main purpose is unknown.
	 * - 0: printing from SD card
	 */
	subtask_id: StringNumber
	/**
	 * TODO
	 */
	subtask_name: string
	/**
	 * Unknown. Bambu Studio appears to do nothing with it.
	 */
	task_id: StringNumber
	/**
	 * Total layer number of the current job.
	 */
	total_layer_num: number
	/**
	 * Firmware upgrade status data of the printer.
	 */
	upgrade_state: {
		/**
		 * Unknown.
		 *
		 * Some component's new version number.
		 */
		ahb_new_version_number: string
		/**
		 * The new version number of the AMS(es).
		 */
		ams_new_version_number: string
		/**
		 * Unknown. Bambu Studio appears to do nothing with it.
		 */
		consistency_request: boolean
		/**
		 * What the display should say in the process.
		 */
		dis_state: UpgradeDisplayState
		/**
		 * Error codes thrown by the upgrade.
		 */
		err_code: UpgradeErrorCode
		/**
		 * Unknown. Bambu Studio appears to do nothing with it.
		 *
		 * Probably has something to do with an update the user can't deny. (for ex.: security vulnerabilities)
		 */
		force_upgrade: boolean
		/**
		 * Unknown. Bambu Studio appears to do nothing with it.
		 */
		message: string
		/**
		 * Unknown. Bambu Studio appears to do nothing with it.
		 */
		module: string
		/**
		 * Unknown. Bambu Studio appears to do nothing with it.
		 */
		new_ver_list: string
		/**
		 * Unknown. Bambu Studio appears to do nothing with it.
		 */
		new_version_state: number
		/**
		 * Unknown. Bambu Studio appears to do nothing with it.
		 */
		ota_new_version_number: string
		/**
		 * The progress of the update in %.
		 */
		progress: StringNumberRange<0, 100>
		/**
		 * Incremented by one every time a new status is returned.
		 */
		sequence_id: number
		/**
		 * The progress / finish states of the upgrade.
		 */
		status: UpgradeStatusProgressState & UpgradeStatusFinishState
	}
	/**
	 * Print file download status data.
	 */
	upload: {
		/**
		 * Downloaded file size (?)
		 */
		file_size: number
		/**
		 * Total file size (?)
		 */
		finish_size: number
		/**
		 * Unknown. Bambu Studio doesn't even check for it.
		 */
		message: string
		/**
		 * Unknown. Bambu Studio doesn't even check for it.
		 */
		oss_url: string
		/**
		 * The progress of the file download in %.
		 */
		progress: StringNumberRange<0, 100>
		/**
		 * Incremented by one every time a new status is returned.
		 */
		sequence_id: StringNumber
		/**
		 * Download speed in unknown units.
		 */
		speed: number
		/**
		 * Unknown. Bambu Studio doesn't even check for it.
		 */
		status: "idle" | string
		/**
		 * Unknown. Bambu Studio doesn't even check for it.
		 */
		task_id: string
		/**
		 * Time remaining until download completes in unknown units.
		 */
		time_remaining: number
		/**
		 * Unknown. Bambu Studio doesn't even check for it.
		 *
		 * Probably some kind of error code.
		 */
		trouble_id: string
	}
	/**
	 * External spool (tray). This has unused values due to being a copy of the AMS trays.
	 */
	vt_tray: ExternalTray
	/**
	 * The signal strength of the Wi-Fi signal which the printer is connected to in dBm.
	 */
	wifi_signal: `-${number}dBm`
	/**
	 * AI-related features of the printer's camera.
	 */
	xcam: {
		/**
		 * Whether skipping parts setting is enabled.
		 */
		allow_skip_parts: boolean
		/**
		 * Whether the printer should detect the correct orientation and type of the buildplate.
		 */
		buildplate_marker_detector: boolean
		/**
		 * Whether the first layer inspection is enabled for the printer.
		 */
		first_layer_inspector: boolean
		/**
		 * Whether the printer is allowed to stop the print in the event it detects an abnormality.
		 */
		print_halt: boolean
		/**
		 * The sensitivity for the spaghetti detector, first layer inspection, etc.
		 */
		halt_print_sensitivity: "low" | "medium" | "high"
		/**
		 * Whether print monitoring is enabled.
		 */
		printing_monitor: boolean
		/**
		 * Whether the spaghetti detector is enabled.
		 */
		spaghetti_detector: boolean
	}
	/**
	 * AI-related features' status.
	 */
	xcam_status: StringNumber
}

export type PrinterStatus =
	| "FINISH"
	| "FAILED"
	| "RUNNING"
	| "IDLE"
	| "PAUSE"
	| "PREPARE"
	| "SLICING"

/**
 * Every stage of a print.
 *
 * Extracted from https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L33-L70
 */
export enum PrintStage {
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

/**
 * Speed levels of the printer.
 *
 * Extracted from https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.hpp#L73-L80
 */
export enum SpeedLevel {
	SILENT = "1",
	NORMAL = "2",
	SPORT = "3",
	LUDICROUS = "4",
}

/**
 * An AMS instance.
 */
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

/**
 * An AMS tray (filament slot) instance.
 */
export interface AMSTray {
	/**
	 * Unknown. Bambu Studio appears to do nothing with it.
	 */
	bed_temp: string
	/**
	 * Unknown. Bambu Studio appears to do nothing with it.
	 */
	bed_temp_type: string
	/**
	 * Unknown. Bambu Studio doesn't even check for it.
	 *
	 * Probably the temperature required for filament drying.
	 */
	drying_temp: string
	/**
	 * Probably the time required for filament drying.
	 */
	drying_time: string
	/**
	 * The ID of the tray.
	 */
	id: string
	/**
	 * The loaded filament's maximum nozzle temperature.
	 */
	nozzle_temp_max: StringNumber
	/**
	 * The loaded filament's minimum nozzle temperature.
	 */
	nozzle_temp_min: StringNumber
	/**
	 * Use is unknown.
	 */
	remain: number
	/**
	 * The UID of the filament's NFC that was scanned.
	 *
	 * Uses:
	 * - Check if filament's manufacturer is Bambu Lab: https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1090-L1101
	 *
	 * TODO: Extract when received from printer / provide helper function to do so.
	 */
	tag_uid: string
	/**
	 * The color of the tray (build plate?). No use cases are known.
	 */
	tray_color: string
	/**
	 * The diameter of the tray (build plate?). No use cases are known.
	 */
	tray_diameter: string
	/**
	 * Unknown. Bambu Studio appears to do nothing with it.
	 */
	tray_id_name: string
	/**
	 * No use cases are known.
	 */
	tray_info_idx: string
	/**
	 * No use cases are known.
	 */
	tray_sub_brands: string
	/**
	 * No use cases are known.
	 */
	tray_type: string
	/**
	 * Unknown. Bambu Studio appears to do nothing with it.
	 */
	tray_uuid: string
	/**
	 * Unknown. Bambu Studio appears to do nothing with it.
	 */
	tray_weight: string
	/**
	 * Information about the AI camera features (?)
	 */
	xcam_info: string
}

/**
 * External spool (tray). This has unused values due to being a copy of the AMS trays.
 */
export interface ExternalTray extends AMSTray {
	/**
	 * Unused.
	 */
	bed_temp: "0"
	/**
	 * Unused.
	 */
	bed_temp_type: "0"
	/**
	 * Unknown. Bambu Studio appears to do nothing with it.
	 */
	cols: StringNumber[]
	id: "254"
	/**
	 * The loaded filament's "k" value (manually set in Bambu Studio).
	 */
	k: number
	/**
	 * The loaded filament's "n" value (manually set in Bambu Studio).
	 */
	n: number
	nozzle_temp_max: StringNumber
	nozzle_temp_min: StringNumber
	remain: 0
	/**
	 * The UID of the filament's NFC that was manually added in Bambu Studio.
	 *
	 * Uses:
	 * - Check if filament's manufacturer is Bambu Lab: https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L1090-L1101
	 *
	 * TODO: Extract when received from printer / provide helper function to do so.
	 */
	tag_uid: string
	/**
	 * Unknown.
	 *
	 * Perhaps the color of the printing plate. (?)
	 */
	tray_color: string
	tray_diameter: StringNumber
	tray_id_name: string
	tray_info_idx: string
	tray_sub_brands: string
	tray_temp: StringNumber
	tray_time: StringNumber
	tray_type: string
	tray_uuid: string
	tray_weight: "0"
	xcam_info: string
}

/**
 * Status of the AMS' RFID reader.
 */
export enum AmsRFIDStatus {
	IDLE = 0,
	READING = 1,
	GCODE_TRANS = 2,
	GCODE_RUNNING = 3,
	ASSISTANT = 4,
	SWITCH_FILAMENT = 5,
	HAS_FILAMENT = 6,
}

/**
 * Bambu Lab's proprietary Health Management System (HMS).
 *
 * More info: https://wiki.bambulab.com/en/x1/troubleshooting/intro-hms
 *
 * All error codes: https://wiki.bambulab.com/en/hms/home
 */
export interface HMS {
	attr: number
	code: number
}

/**
 * Interior lighting related status instance.
 */
export interface LightReport {
	node: "chamber_light" | "work_light"
	mode: "on" | "off" | "flashing"
}

/**
 * The possible progress states of a firmware upgrade.
 *
 * Extracted from https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L3481-L3494
 */
export enum UpgradeStatusProgressState {
	DOWNLOADING = "DOWNLOADING",
	UPGRADE_REQUEST = "UPGRADE_REQUEST",
	PRE_FLASH_START = "PRE_FLASH_START",
	PRE_FLASH_SUCCESS = "PRE_FLASH_SUCCESS",
}

/**
 * The possible finish states of a firmware upgrade.
 *
 * Extracted from https://github.com/bambulab/BambuStudio/blob/master/src/slic3r/GUI/DeviceManager.cpp#L3481-L3494
 */
export enum UpgradeStatusFinishState {
	UPGRADE_SUCCESS = "UPGRADE_SUCCESS",
	DOWNLOAD_FAIL = "DOWNLOAD_FAIL",
	FLASH_FAIL = "FLASH_FAIL",
	PRE_FLASH_FAIL = "PRE_FLASH_FAIL",
	UPGRADE_FAIL = "UPGRADE_FAIL",
}

/**
 * Error codes thrown by the upgrade.
 */
export enum UpgradeErrorCode {
	UpgradeNoError = 0,
	UpgradeDownloadFailed = 1,
	UpgradeVerifyFailed = 2,
	UpgradeFlashFailed = 3,
	UpgradePrinting = 4,
}

/**
 * The possible states the printer's screen will display.
 */
export enum UpgradeDisplayState {
	UNAVAILABLE = 0,
	IDLE = 1,
	UPGRADING = 2,
	UPGRADE_FINISHED = 3,
}

export function isPushAllCommand(data: PrintMessageCommand): data is PushAllCommand {
	return data.command === "push_status" && Object.keys(data).length >= 40
}
