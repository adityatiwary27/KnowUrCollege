# Stops any process listening on port 8080 and starts the Spring Boot app
$port = 8080
try {
    $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        $pids = $conn | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($pid in $pids) {
            Write-Host "Stopping process $pid listening on port $port"
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    } else {
        Write-Host "No process currently listening on port $port"
    }
} catch {
    Write-Host "Get-NetTCPConnection not available or failed — falling back to netstat lookup"
    $output = netstat -ano | findstr :$port
    if ($output) {
        $lines = $output -split "`n"
        foreach ($line in $lines) {
            $parts = $line -split "\s+"
            $pid = $parts[-1]
            if ($pid -and $pid -ne "PID") {
                Write-Host "Stopping process $pid listening on port $port (via netstat)"
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
    } else {
        Write-Host "No process found by netstat on port $port"
    }
}

Write-Host "Starting Spring Boot application..."
mvn spring-boot:run
