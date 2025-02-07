export default function Duration({ label, id, name, errors, register}) {
    return (
        <>
            <div class="field-row-stacked">
                <label for={id}>{label}</label>
                <input type="text" id={id} {...register(name)} autocomplete="off" />
            </div>
            {errors && <p class="error-message">{errors.message}</p>}
        </>
    )
}