interface Login {
    email: string;
    password: string;
    role: number;
}


interface ProjectInfo{
    superadmin_token: string;
    company_name: string;
    TelEditor_email: string;
    TelEditor_secret_key: string;
    Com_Editor_email: string;
    Com_Editor_secret_key: string;
    project_name: string;


}


interface editorResiteration{
    secret_key: string;
    email: string;
    password: string;
    role: number;

}

interface superadminRegistration{
    email: string;
    password: string;
    role: number;

}



export type { Login, ProjectInfo, editorResiteration, superadminRegistration };
