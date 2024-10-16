export const getOutComeBtnState = (detail: any, key: any) => {
    let buttonState = "enable";
    const {
        accept,
        reject,
        test_ordered
    } = detail;

    if (key == 'accept') {
        if (accept) {
            buttonState = "active";
        }
        if (reject) {
            buttonState = "disable";
        }
    }

    if (key == 'reject') {

        if (reject) {
            buttonState = "active";
        }

      
        if (accept || test_ordered) {
            buttonState = "disable";
        }
    }

    if (key == 'test_ordered') {
        if (test_ordered == false) {
            buttonState = "disable";
        }
        if (accept) {
            buttonState = "enable";
        }
        if (reject) {
            buttonState = "disable";
        }
        if (test_ordered && accept) {
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