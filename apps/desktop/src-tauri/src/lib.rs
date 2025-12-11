// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use std::path::PathBuf;
use tauri_plugin_dialog::DialogExt;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Select a directory using the system's native directory picker dialog
/// 
/// # Arguments
/// * `initial_directory` - Optional initial directory to open the dialog in
#[tauri::command]
async fn select_directory(app: tauri::AppHandle, initial_directory: Option<String>) -> Result<Option<String>, String> {
    let mut dialog = app
        .dialog()
        .file()
        .set_title("选择导出目录");
    
    // Set initial directory if provided and exists
    if let Some(ref dir) = initial_directory {
        let path = PathBuf::from(dir);
        if path.exists() && path.is_dir() {
            dialog = dialog.set_directory(path);
        }
    }
    
    let result = dialog.blocking_pick_folder();
    
    match result {
        Some(path) => Ok(Some(path.to_string())),
        None => Ok(None),
    }
}

/// Save file content to a specified path
#[tauri::command]
async fn save_file(path: String, filename: String, content: Vec<u8>) -> Result<(), String> {
    let full_path = PathBuf::from(&path).join(&filename);
    
    // Ensure the directory exists
    if let Some(parent) = full_path.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
    }
    
    // Write the file
    fs::write(&full_path, content).map_err(|e| format!("Failed to write file: {}", e))?;
    
    Ok(())
}

/// Get the system's downloads directory
#[tauri::command]
fn get_downloads_dir() -> Result<String, String> {
    dirs::download_dir()
        .map(|p| p.to_string_lossy().to_string())
        .ok_or_else(|| "Could not determine downloads directory".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            select_directory,
            save_file,
            get_downloads_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
