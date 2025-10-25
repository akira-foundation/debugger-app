use tokio::net::TcpListener;
use tauri::AppHandle;
use crate::logger::process_log;

const DEFAULT_HOST: &str = "127.0.0.1";
const DEFAULT_PORT: u16 = 23517;

pub async fn start_server(app: AppHandle) {
    let addr = format!("{}:{}", DEFAULT_HOST, DEFAULT_PORT);
    match TcpListener::bind(&addr).await {
        Ok(listener) => {
            println!("🛰️  Listening on {}", addr);
            handle_connections(listener, app).await;
        }
        Err(e) => {
            eprintln!("❌ Failed to bind address: {}", e);
        }
    }
}

async fn handle_connections(listener: TcpListener, app: AppHandle) {
    loop {
        if let Ok((socket, _)) = listener.accept().await {
            let app_clone = app.clone();
            tokio::spawn(async move {
                handle_client(socket, app_clone).await;
            });
        }
    }
}

async fn handle_client(mut socket: tokio::net::TcpStream, app: AppHandle) {
    use tokio::io::{AsyncReadExt, AsyncWriteExt};

    let mut buffer = vec![0u8; 1024 * 1024];

    loop {
        match socket.read(&mut buffer).await {
            Ok(0) => break,
            Ok(size) => {
                let data = String::from_utf8_lossy(&buffer[..size]).to_string();

                // Handle availability check
                if data.contains("/_availability_check") {
                    let response = b"HTTP/1.1 404 Not Found\r\n\
                                     Content-Length: 0\r\n\
                                     Connection: close\r\n\
                                     \r\n";
                    let _ = socket.write_all(response).await;
                    break;
                }

                // Extract and process body
                if let Some(body_start) = data.find("\r\n\r\n") {
                    let body = data[body_start + 4..].trim();
                    if !body.is_empty() && body != "{}" {
                        process_log(body, &app);
                    }
                } else if data.starts_with('{') {
                    process_log(&data, &app);
                }

                // Send response
                let response = b"HTTP/1.1 200 OK\r\n\
Content-Length: 0\r\n\
Connection: keep-alive\r\n\
Server: ray\r\n\
\r\n";

                if let Err(_) = socket.write_all(response).await {
                    break;
                }
            }
            Err(_) => break,
        }
    }
}
