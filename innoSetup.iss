; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "PipeDefectManager"
#define MyAppVersion "1.6.0"
#define MyAppPublisher "PXD"
#define MyAppExeName "main.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{B2EA78F1-6E39-4187-BA45-314604597579}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
; Uncomment the following line to run in non administrative install mode (install for current user only.)
;PrivilegesRequired=lowest
OutputDir=C:\Users\YTMartian\Desktop
OutputBaseFilename=PipeDefectManager
SetupIconFile=C:\Users\YTMartian\Desktop\ico.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "chinese"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "F:\Graduation-Project\缺陷管理软件6\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "F:\Graduation-Project\缺陷管理软件6\start.vbs"; DestDir: "{app}"; Flags: ignoreversion
Source: "F:\Graduation-Project\缺陷管理软件6\template.docx"; DestDir: "{app}"; Flags: ignoreversion
Source: "F:\Graduation-Project\缺陷管理软件6\browser-win32-x64\*"; DestDir: "{app}\browser-win32-x64"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "F:\Graduation-Project\缺陷管理软件6\manage\*"; DestDir: "{app}\manage"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "F:\Graduation-Project\缺陷管理软件6\misc\*"; DestDir: "{app}\misc"; Flags: ignoreversion recursesubdirs createallsubdirs
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

