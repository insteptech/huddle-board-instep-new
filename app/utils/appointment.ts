export const getOutComeBtnState = (detail: any, key: any) => {
    let buttonState = "enable";
    const {
        clinician_agrees,
        clinician_disagrees,
        test_ordered
    } = detail;

    if (key == 'clinician_agrees') {
        if (clinician_agrees) {
            buttonState = "active";
        }
        if (clinician_disagrees) {
            buttonState = "disable";
        }
    }

    if (key == 'clinician_disagrees') {

        if (clinician_disagrees) {
            buttonState = "active";
        }

      
        if (clinician_agrees || test_ordered) {
            buttonState = "disable";
        }
    }

    if (key == 'test_ordered') {
        if (test_ordered == false) {
            buttonState = "disable";
        }
        if (clinician_agrees) {
            buttonState = "enable";
        }
        if (clinician_disagrees) {
            buttonState = "disable";
        }
        if (test_ordered && clinician_agrees) {
            buttonState = "active";
        }
    }
    return buttonState;
}

export const sortArraysInObject = (obj: any) => {
    for (let key in obj) {
        if (Array.isArray(obj[key])) {
            if (obj[key].length > 0 && typeof obj[key][0] === 'object' && 'name' in obj[key][0]) {
                obj[key].sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
            } else {
                obj[key].sort();
            }
        }
    }
    return obj;
}

export const sortObjectsByName = (arr: any) => {
    return arr?.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
}